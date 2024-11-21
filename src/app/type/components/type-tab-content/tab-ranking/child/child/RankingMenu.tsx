import {
  useSceneAtom,
  useSetIsLoadingOverlayAtom,
  useSetLineResultsAtom,
  useSetTypePageSpeedAtom,
} from "@/app/type/type-atoms/gameRenderAtoms";
import { Button, Stack, useTheme } from "@chakra-ui/react";
import { Dispatch, DispatchWithoutAction, useCallback } from "react";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import { YTSpeedController } from "@/app/type/ts/ytHandleEvents";
import { useProceedRetry } from "@/app/type/hooks/playing-hooks/useRetry";
import { useDownloadResultJson } from "@/app/type/hooks/data-query/useDownloadResultJson";
import { LineResultData } from "@/app/type/ts/type";
import MenuClapButton from "./child/MenuClapButton";
import { LocalClapState, ThemeColors, UploadResult } from "@/types";

interface RankingMenuProps {
  resultId: number;
  userId: number;
  name: string;
  setShowMenu: Dispatch<number | null>;
  setHoveredIndex: Dispatch<number | null>;
  clapOptimisticState: LocalClapState;
  toggleClapAction: (resultId: number) => Promise<UploadResult>;
}
const RankingMenu = ({
  resultId,
  userId,
  name,
  setShowMenu,
  setHoveredIndex,
  clapOptimisticState,
  toggleClapAction,
}: RankingMenuProps) => {
  const { gameStateRef, playerRef } = useRefs();
  const theme: ThemeColors = useTheme();
  const scene = useSceneAtom();
  const setSpeedData = useSetTypePageSpeedAtom();
  const proceedRetry = useProceedRetry();
  const downloadResultJson = useDownloadResultJson();
  const setLineResults = useSetLineResultsAtom();
  const setIsLoadingOverlay = useSetIsLoadingOverlayAtom();

  const handleReplayClick = useCallback(
    async (name: string) => {
      setIsLoadingOverlay(true);
      const result: LineResultData[] = await downloadResultJson(resultId);
      setIsLoadingOverlay(false);

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
    [],
  );
  return (
    <Stack
      className="rounded-md"
      position="absolute"
      zIndex="9999"
      bg={theme.colors.background.body}
      color={theme.colors.text.body}
      boxShadow="md"
      p={2}
      border="0.5px"
      borderColor={theme.colors.border.card}
      top={{ base: "-60px", md: "auto" }}
    >
      <Button
        as="a"
        href={`/user/${userId}`}
        variant="unstyled"
        size="md"
        _hover={{ backgroundColor: theme.colors.button.sub.hover }}
      >
        ユーザーページへ
      </Button>
      <Button
        variant="unstyled"
        size="md"
        _hover={{ backgroundColor: theme.colors.button.sub.hover }}
        onClick={() => handleReplayClick(name)}
        isDisabled={scene === "playing" || scene === "replay" || scene === "practice"}
      >
        リプレイ再生
      </Button>
      <MenuClapButton
        resultId={resultId}
        clapOptimisticState={clapOptimisticState}
        toggleClapAction={toggleClapAction}
      />
    </Stack>
  );
};

export default RankingMenu;
