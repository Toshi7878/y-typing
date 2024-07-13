"use client";

import React, { useEffect, useState } from "react";

import { Box, Button, Spinner, Stack, Td, Tooltip, Tr } from "@chakra-ui/react"; // Boxコンポーネントを追加
import { useQuery } from "@tanstack/react-query";

import { useParams } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRefs } from "@/app/type/(contexts)/refsProvider";
import { SendResultData } from "@/app/type/(ts)/type";

const RankingList = () => {
  const { id } = useParams();
  const { data: session } = useSession();
  const { bestScoreRef } = useRefs();
  const [showMenu, setShowMenu] = useState<number | null>(null); // showMenuの状態をインデックスに変更

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
          ) // Buttonタグを除外
      ) {
        setShowMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const { data, error, isLoading } = useQuery({
    queryKey: ["userRanking", id, Number(session?.user?.id)],
    queryFn: async ({ queryKey }) => {
      const [_key, id, userId] = queryKey;

      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/ranking?id=${id}`);

      for (let i = 0; i < data.length; i++) {
        if (userId === data[i].userId) {
          bestScoreRef.current = data[i].status.score;
        }
      }

      // データ取得ロジックをここに追加
      return data;
    },

    enabled: !!id, // useQueryをidが存在する場合にのみ実行
    staleTime: Infinity, // データを常に新鮮に保つ
    refetchOnWindowFocus: false, // ウィンドウフォーカス時に再フェッチしない
    refetchOnReconnect: false, // 再接続時に再フェッチしない
    refetchOnMount: false, // マウント時に再フェッチしない
  });

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
        data.map(
          (
            user: { userId: string; user: { name: string }; status: SendResultData["status"] },
            index: number,
          ) => (
            <Tooltip
              label={
                <div>
                  <div>タイプ数: {user.status.type}</div>
                  <div>ミス数: {user.status.miss}</div>
                  <div>ロスト数: {user.status.lost}</div>
                  <div>最大コンボ: {user.status.maxCombo}</div>
                </div>
              }
              placement="bottom"
              key={index}
            >
              <React.Fragment>
                <Tr
                  _hover={{ backgroundColor: "gray.100" }}
                  className="cursor-pointer"
                  onClick={() => {
                    if (showMenu !== null) {
                      setShowMenu(null);
                    } else {
                      setShowMenu(index);
                    }
                  }}
                >
                  <Td>{index + 1}</Td>
                  <Td>{user.user.name}</Td>
                  <Td>{user.status.score}</Td>
                  <Td>
                    {(
                      Math.round(
                        (user.status.type / (user.status.miss + user.status.type)) * 100 * 10,
                      ) / 10
                    ).toFixed(2) + "%"}
                  </Td>
                  <Td>{user.status.kpm}</Td>
                </Tr>
                {showMenu === index && ( // クリックされた行のメニューを表示
                  <Stack
                    className="rounded-md"
                    position="absolute"
                    zIndex="tooltip"
                    bg="white"
                    boxShadow="md"
                    p={2} // パディングを追加
                  >
                    <Button
                      as="a" // Linkとして機能させる
                      href={`/user/${user.userId}`} // ユーザーページへのリンク
                      variant="unstyled" // ボタンのスタイルを変更
                      size="sm"
                      _hover={{ backgroundColor: "gray.200" }} // ホバー時の背景色を追加
                    >
                      ユーザーページへ
                    </Button>
                    <Button
                      variant="unstyled" // ボタンのスタイルを変更
                      size="sm"
                      _hover={{ backgroundColor: "gray.200" }} // ホバー時の背景色を追加
                      onClick={() => {
                        /* リプレイ再生ロジック */
                      }}
                    >
                      リプレイ再生
                    </Button>
                  </Stack>
                )}
              </React.Fragment>
            </Tooltip>
          ),
        )}
    </>
  );
};

export default RankingList;
