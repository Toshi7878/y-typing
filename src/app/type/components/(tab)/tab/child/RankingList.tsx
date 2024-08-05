"use client";

import React, { useEffect, useState } from "react";
import { Box, Spinner } from "@chakra-ui/react"; // Boxコンポーネントを追加
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRefs } from "@/app/type/(contexts)/refsProvider";
import { RankingListType } from "@/app/type/(ts)/type";
import RankingTr from "./child/RankingTr";
import RankingMenu from "./child/RankingMenu";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { rankingScoresAtom, sceneAtom } from "@/app/type/(atoms)/gameRenderAtoms";

const RankingList = () => {
  const { id } = useParams();
  const { data: session } = useSession();
  const { bestScoreRef } = useRefs();
  const [showMenu, setShowMenu] = useState<number | null>(null); // showMenuの状態をインデックスに変更
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const setRankingScores = useSetAtom(rankingScoresAtom);
  const scene = useAtomValue(sceneAtom);

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
    queryKey: ["userRanking", id],
    queryFn: async ({ queryKey }) => {
      const [_key, id] = queryKey;

      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/ranking?id=${id}`);

      // scoreが高い順にソート
      data.sort((a: { score: number }, b: { score: number }) => b.score - a.score);

      return data;
    },

    enabled: !!id, // useQueryをidが存在する場合にのみ実行
    staleTime: Infinity, // データを常に新鮮に保つ
    refetchOnWindowFocus: false, // ウィンドウフォーカス時に再フェッチしない
    refetchOnReconnect: false, // 再接続時に再フェッチしない
    refetchOnMount: false, // マウント時に再フェッチしない
  });

  useEffect(() => {
    const scores = data ? data.map((result: RankingListType) => result.score) : [];

    setRankingScores(scores);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    const userId = Number(session?.user?.id);

    if (scene === "playing" && data) {
      for (let i = 0; i < data.length; i++) {
        if (userId === Number(data[i].userId)) {
          bestScoreRef.current = data[i].score;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, data]);

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
                sessionUserId={Number(session?.user?.id)}
                rankingUserId={Number(user.userId)}
                rank={index + 1}
                name={user.user.name}
                score={user.score}
                type={type}
                kpm={user.status.kpm}
                rkpm={user.status.rkpm}
                defaultSpeed={user.status.defaultSpeed}
                romaType={romaType}
                kanaType={kanaType}
                flickType={flickType}
                miss={user.status.miss}
                lost={user.status.lost}
                maxCombo={user.status.maxCombo}
                updatedAt={user.updatedAt}
                isHighlighted={showMenu === index}
                isHovered={hoveredIndex === index}
                handleShowMenu={handleShowMenu}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {showMenu === index && (
                <RankingMenu
                  userId={user.userId}
                  name={user.user.name}
                  setShowMenu={setShowMenu}
                  setHoveredIndex={setHoveredIndex}
                />
              )}
            </React.Fragment>
          );
        })}
    </>
  );
};

RankingList.displayName = "RankingList";

export default RankingList;
