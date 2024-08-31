import { lineResultsAtom, loadingOverlayAtom } from "@/app/type/type-atoms/gameRenderAtoms";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import { LineResultData, SendResultData } from "@/app/type/ts/type";
import { Button, useTheme } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSetAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useCallback } from "react";

const ReadyPracticeButton = () => {
  const { gameStateRef, playerRef } = useRefs();
  const { data: session } = useSession();
  const { id } = useParams();
  const setIsLoadingOverlay = useSetAtom(loadingOverlayAtom);
  const setLineResults = useSetAtom(lineResultsAtom);
  const theme = useTheme();

  const mapId = id;
  const userId = session?.user?.id;
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["practiceData", Number(userId), Number(mapId)],
    queryFn: async () => {
      const response = await axios.get<{
        lineResult: LineResultData[];
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

  const handleClick = useCallback(async () => {
    if (gameStateRef.current!.practice.hasMyRankingData) {
      setIsLoadingOverlay(true);
      const result = await refetch();
      setIsLoadingOverlay(false);
      setLineResults(result.data!.lineResult);
    }

    gameStateRef.current!.playMode = "practice";
    playerRef.current.playVideo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);
  return (
    <Button
      variant="outline"
      borderColor={theme.colors.card.borderColor}
      color={theme.colors.card.color}
      px={16}
      py={6}
      size="xl"
      className="text-3xl"
      _hover={{
        bg: theme.colors.card.hover.bg,
      }}
      onClick={handleClick}
    >
      練習モードで開始
    </Button>
  );
};

export default ReadyPracticeButton;
