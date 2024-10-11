import { useSceneAtom, useSetTypePageSpeedAtom } from "@/app/type/type-atoms/gameRenderAtoms";
import { Button, Stack, useTheme } from "@chakra-ui/react";
import { useCallback } from "react";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import { YTSpeedController } from "@/app/type/ts/ytHandleEvents";
import { useProceedRetry } from "@/app/type/hooks/playing-hooks/useRetry";
import { usePracticeDataQuery } from "@/app/type/hooks/data-query/usePracticeDataQuery";
import { useQuery } from "@tanstack/react-query";

const RankingMenu = ({
  userId,
  name,
  setShowMenu,
  setHoveredIndex,
}: {
  userId: string;
  name: string;
  setShowMenu: React.Dispatch<React.SetStateAction<number | null>>;
  setHoveredIndex: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const { gameStateRef, playerRef } = useRefs();
  const theme = useTheme();
  const scene = useSceneAtom();
  const setSpeedData = useSetTypePageSpeedAtom();
  const proceedRetry = useProceedRetry();
  const { refetch } = usePracticeDataQuery(Number(userId));

  const handleReplayClick = useCallback(
    async (name: string) => {
      const result = await refetch();
      if (result.data) {
        if (scene === "end") {
          proceedRetry("replay");
        }
        setShowMenu(null);
        setHoveredIndex(null);
        gameStateRef.current!.replay.userName = name;
        gameStateRef.current!.playMode = "replay";
        const defaultSpeed = result.data.lineResult[0].status?.sp;

        new YTSpeedController("setDefaultSpeed", {
          setSpeedData,
          playerRef: playerRef.current,
          speed: defaultSpeed,
          defaultSpeed: defaultSpeed,
        });
        playerRef.current.playVideo();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refetch],
  );
  return (
    <Stack
      className="rounded-md"
      position="absolute"
      zIndex="9999"
      bg={theme.colors.popup.bg}
      color={theme.colors.popup.color}
      boxShadow="md"
      p={2}
      top={{ base: "-60px", md: "auto" }}
    >
      <Button
        as="a"
        href={`/user/${userId}`}
        variant="unstyled"
        size="md"
        _hover={{ backgroundColor: theme.colors.popup.hover.bg }}
      >
        ユーザーページへ
      </Button>
      <Button
        variant="unstyled"
        size="md"
        _hover={{ backgroundColor: theme.colors.popup.hover.bg }}
        onClick={() => handleReplayClick(name)}
        isDisabled={scene === "playing" || scene === "replay" || scene === "practice"}
      >
        リプレイ再生
      </Button>
    </Stack>
  );
};

export default RankingMenu;
