import {
  lineResultsAtom,
  loadingOverlayAtom,
  mapAtom,
  sceneAtom,
  speedAtom,
} from "@/app/type/type-atoms/gameRenderAtoms";
import { LineResultData, SendResultData } from "@/app/type/ts/type";
import { Button, Stack, useTheme } from "@chakra-ui/react";
import axios from "axios";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import { YTSpeedController } from "@/app/type/ts/ytHandleEvents";
import { proceedRetry } from "@/app/type/ts/retry";

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
  const { gameStateRef, playerRef, statusRef, tabStatusRef, playingComboRef } = useRefs();
  const theme = useTheme();

  const [scene, setScene] = useAtom(sceneAtom);
  const setSpeedData = useSetAtom(speedAtom);
  const setIsLoadingOverlay = useSetAtom(loadingOverlayAtom);
  const setLineResults = useSetAtom(lineResultsAtom);

  const map = useAtomValue(mapAtom);
  const params = useParams();
  const mapId = params.id as string;

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["replayData", Number(userId), Number(mapId)],
    queryFn: async () => {
      const response = await axios.get<{
        lineResult: LineResultData[];
        defaultSpeed: SendResultData["status"]["defaultSpeed"];
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

  const handleReplayClick = useCallback(
    async (name: string) => {
      setIsLoadingOverlay(true);
      const result = await refetch();
      setIsLoadingOverlay(false);
      if (result.data) {
        if (scene === "end") {
          proceedRetry(
            "replay",
            setLineResults,
            map!,
            statusRef,
            setScene,
            tabStatusRef,
            playingComboRef,
            gameStateRef,
            playerRef,
          );
        }
        setShowMenu(null);
        setHoveredIndex(null);
        setLineResults(result.data.lineResult);
        gameStateRef.current!.replay.userName = name;
        gameStateRef.current!.playMode = "replay";

        const defaultSpeed = result.data.defaultSpeed;
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
