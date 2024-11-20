import { useRefs } from "@/app/type/type-contexts/refsProvider";
import { Button, useTheme } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { useSession } from "next-auth/react";
import { useDownloadResultJson } from "@/app/type/hooks/data-query/useDownloadResultJson";
import {
  useSetIsLoadingOverlayAtom,
  useSetLineResultsAtom,
} from "@/app/type/type-atoms/gameRenderAtoms";
import { useUserResultIdQuery } from "@/app/type/hooks/data-query/useUserResultIdQuery";
import { ThemeColors } from "@/types";

const ReadyPracticeButton = () => {
  const { data: session } = useSession();

  const { gameStateRef, playerRef } = useRefs();
  const getUserResultId = useUserResultIdQuery(Number(session?.user?.id));
  const downloadResultJson = useDownloadResultJson();
  const setLineResults = useSetLineResultsAtom();
  const setIsLoadingOverlay = useSetIsLoadingOverlayAtom();

  const theme: ThemeColors = useTheme();

  const handleClick = useCallback(async () => {
    if (gameStateRef.current!.practice.hasMyRankingData) {
      setIsLoadingOverlay(true);
      const { data: resultData } = await getUserResultId?.refetch();
      const resultId = resultData?.id; // resultIdを取得
      const result = await downloadResultJson(resultId as number);
      setLineResults(result);
      setIsLoadingOverlay(false);
    }

    gameStateRef.current!.playMode = "practice";
    playerRef.current.playVideo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Button
      variant="outline"
      borderColor={theme.colors.border.card}
      color={theme.colors.text.body}
      px={16}
      py={6}
      size="xl"
      className="text-3xl"
      _hover={{
        bg: theme.colors.button.sub.hover,
      }}
      onClick={handleClick}
    >
      練習モードで開始
    </Button>
  );
};

export default ReadyPracticeButton;
