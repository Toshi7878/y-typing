"use client";

import React from "react";

import { Box, Spinner, Td, Tr } from "@chakra-ui/react"; // Boxコンポーネントを追加
import { useQuery } from "@tanstack/react-query";
import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

const RankingList = () => {
  const { id } = useParams();

  const { data, error, isLoading } = useQuery({
    queryKey: ["userRanking", id],
    queryFn: async () => {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/ranking?id=${id}`);

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
            user: { userId: string; user: { name: string }; status: { score: number } },
            index: number,
          ) => (
            <Tr key={index}>
              <Td>{index + 1}</Td>
              <Td>
                <Link href={`/user/${user.userId}`}>{user.user.name}</Link>
              </Td>
              <Td>{user.status.score}</Td>
            </Tr>
          ),
        )}
    </>
  );
};

export default RankingList;
