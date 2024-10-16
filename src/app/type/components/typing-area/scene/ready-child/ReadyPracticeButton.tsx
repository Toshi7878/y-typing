import { useRefs } from "@/app/type/type-contexts/refsProvider";
import { Button, useTheme } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { usePracticeDataQuery } from "@/app/type/hooks/data-query/usePracticeDataQuery";
import { useSession } from "next-auth/react";

const ReadyPracticeButton = () => {
  const { data: session } = useSession();
  const { gameStateRef, playerRef } = useRefs();
  const { refetch } = usePracticeDataQuery(Number(session?.user.id));
  const theme = useTheme();

  const handleClick = useCallback(async () => {
    if (gameStateRef.current!.practice.hasMyRankingData) {
      await refetch();
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
