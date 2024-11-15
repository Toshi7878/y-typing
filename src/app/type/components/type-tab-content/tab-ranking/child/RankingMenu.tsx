import {
  useSceneAtom,
  useSetLineResultsAtom,
  useSetTypePageSpeedAtom,
} from "@/app/type/type-atoms/gameRenderAtoms";
import { Button, Stack, useTheme } from "@chakra-ui/react";
import { useCallback } from "react";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import { YTSpeedController } from "@/app/type/ts/ytHandleEvents";
import { useProceedRetry } from "@/app/type/hooks/playing-hooks/useRetry";
import { usePracticeDataQuery } from "@/app/type/hooks/data-query/usePracticeDataQuery";
import { useDownloadResultJson } from "@/app/type/hooks/useDownloadResultJson";
import { LineResultData } from "@/app/type/ts/type";

const RankingMenu = ({
  resultId,
  userId,
  name,
  setShowMenu,
  setHoveredIndex,
}: {
  resultId: number;
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
  const downloadResultJson = useDownloadResultJson();
  const setLineResults = useSetLineResultsAtom();

  const handleReplayClick = useCallback(
    async (name: string) => {
      const result: LineResultData[] = await downloadResultJson(resultId);
      // const result = await refetch();
      if (result) {
        if (scene === "end") {
          proceedRetry("replay");
        }
        setShowMenu(null);
        setHoveredIndex(null);
        gameStateRef.current!.replay.userName = name;
        gameStateRef.current!.playMode = "replay";
        const defaultSpeed = result[0].status?.sp;

        new YTSpeedController("setDefaultSpeed", {
          setSpeedData,
          playerRef: playerRef.current,
          speed: defaultSpeed,
          defaultSpeed: defaultSpeed,
        });
        setLineResults(result);
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
      <Button
        variant="unstyled"
        size="md"
        _hover={{ backgroundColor: theme.colors.popup.hover.bg }}
      >
        記録に拍手
      </Button>
    </Stack>
  );
};

export default RankingMenu;
