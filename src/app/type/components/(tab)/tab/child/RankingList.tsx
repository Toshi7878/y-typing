"use client";

import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Box, Spinner } from "@chakra-ui/react"; // Boxコンポーネントを追加
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRefs } from "@/app/type/(contexts)/refsProvider";
import { RankingListType, SendResultData } from "@/app/type/(ts)/type";
import RankingTr from "./child/RankingTr";
import RankingMenu from "./child/RankingMenu";

export interface TabRankingListRef {
  getRankingScores: () => number[];
}
const RankingList = forwardRef((props, ref) => {
  const { id } = useParams();
  const { data: session } = useSession();
  const { tabStatusRef, bestScoreRef, setRef } = useRefs();
  const [showMenu, setShowMenu] = useState<number | null>(null); // showMenuの状態をインデックスに変更
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showMenu !== null &&
        !event
          .composedPath()
          .some(
            (el) =>
              (el as HTMLElement).className?.includes("cursor-pointer") ||
              (el as HTMLElement).tagName === "BUTTON" ||
              (el as HTMLElement).tagName === "A",
          )
      ) {
        setShowMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const { data, error, isLoading } = useQuery<RankingListType[]>({
    queryKey: ["userRanking", id, Number(session?.user?.id)],
    queryFn: async ({ queryKey }) => {
      const [_key, id, userId] = queryKey;

      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/ranking?id=${id}`);

      // scoreが高い順にソート
      data.sort(
        (a: { status: { score: number } }, b: { status: { score: number } }) =>
          b.status.score - a.status.score,
      );

      for (let i = 0; i < data.length; i++) {
        if (userId === data[i].userId) {
          bestScoreRef.current = data[i].status.score;
        }
      }
      const status = tabStatusRef.current!.getStatus();
      const scores = data ? data.map((result: RankingListType) => result.status.score) : [];
      tabStatusRef.current!.setStatus({ ...status, rank: scores.length + 1 });

      return data;
    },

    enabled: !!id, // useQueryをidが存在する場合にのみ実行
    staleTime: Infinity, // データを常に新鮮に保つ
    refetchOnWindowFocus: false, // ウィンドウフォーカス時に再フェッチしない
    refetchOnReconnect: false, // 再接続時に再フェッチしない
    refetchOnMount: false, // マウント時に再フェッチしない
  });

  useImperativeHandle(ref, () => ({
    getRankingScores: () => (data ? data.map((result) => result.status.score) : []),
  }));

  useEffect(() => {
    if (ref && "current" in ref) {
      setRef("tabRankingListRef", ref.current!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (isLoading)
    return (
      <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
        <Spinner size="xl" />
      </Box>
    );
  if (error) return <div>Error loading data</div>;

  return (
    <>
      {data &&
        data.map((user: RankingListType, index: number) => {
          const romaType = user.status.romaType;
          const kanaType = user.status.kanaType;
          const flickType = user.status.flickType;
          const type = romaType + kanaType + flickType;
          const handleShowMenu = () => {
            if (showMenu === index) {
              setShowMenu(null);
            } else {
              setShowMenu(index);
            }
          };

          return (
            <React.Fragment key={index}>
              <RankingTr
                rank={index + 1}
                name={user.user.name}
                score={user.status.score}
                type={type}
                kpm={user.status.kpm}
                handleShowMenu={handleShowMenu}
                romaType={romaType}
                kanaType={kanaType}
                flickType={flickType}
                miss={user.status.miss}
                lost={user.status.lost}
                maxCombo={user.status.maxCombo}
                playSpeed={user.status.playSpeed}
                updatedAt={user.updatedAt}
                isHighlighted={showMenu === index}
                isHovered={hoveredIndex === index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {showMenu === index && <RankingMenu userId={user.userId} />}
            </React.Fragment>
          );
        })}
    </>
  );
});

RankingList.displayName = "RankingList";

export default RankingList;
