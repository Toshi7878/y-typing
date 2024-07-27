"use client";

import { sceneAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { LineResultObj, SendResultData } from "@/app/type/(ts)/type";
import { Button, Stack, useDisclosure } from "@chakra-ui/react"; // Boxコンポーネントを追加
import axios from "axios";
import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import EndTypingResultModal from "@/app/type/components/(typing-area)/scene/child/child/EndTypingResultModal";

const RankingMenu = ({ userId }: { userId: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [scene] = useAtom(sceneAtom);
  const params = useParams();
  const mapId = params.id as string;

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["replayData", Number(userId), Number(mapId)],
    queryFn: async () => {
      const response = await axios.get<{
        lineResult: LineResultObj[];
        status: SendResultData["status"];
      }>(`${process.env.NEXT_PUBLIC_API_URL}/api/replay`, {
        params: {
          mapId: mapId,
          userId: userId,
        },
      });
      return response.data;
    },
    enabled: false,
  });

  const handleReplayClick = useCallback(async () => {
    const result = await refetch();
    if (result.data) {
      // ここでフェッチしたデータを使用して必要な処理を行う
      onOpen();
      console.log(result.data);
    }
  }, [refetch]);
  return (
    <Stack
      className="rounded-md"
      position="absolute"
      zIndex="tooltip"
      bg="white"
      boxShadow="md"
      p={2}
    >
      <Button
        as="a"
        href={`/user/${userId}`}
        variant="unstyled"
        size="sm"
        _hover={{ backgroundColor: "gray.200" }} // ホバー時の背景色を追加
      >
        ユーザーページへ
      </Button>
      <Button
        variant="unstyled" // ボタンのスタイルを変更
        size="sm"
        _hover={{ backgroundColor: "gray.200" }} // ホバー時の背景色を追加
        onClick={handleReplayClick}
        isDisabled={scene === "playing"}
      >
        リプレイ再生
      </Button>

      {data && (
        <EndTypingResultModal
          isOpen={isOpen}
          onClose={onClose}
          typingLineResults={data.lineResult}
        />
      )}
    </Stack>
  );
};

export default RankingMenu;
