import { useSceneAtom } from "@/app/type/type-atoms/gameRenderAtoms";
import { Button, Stack, useTheme } from "@chakra-ui/react";
import { Dispatch } from "react";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import MenuClapButton from "./child/MenuClapButton";
import { LocalClapState, ThemeColors, UploadResult } from "@/types";
import { useSession } from "next-auth/react";

interface RankingMenuProps {
  resultId: number;
  userId: number;
  name: string;
  setShowMenu: Dispatch<number | null>;
  setHoveredIndex: Dispatch<number | null>;
  clapOptimisticState: LocalClapState;
  toggleClapAction: (resultId: number) => Promise<UploadResult>;
  setReplayId: Dispatch<number | null>;
}
const RankingMenu = ({
  resultId,
  userId,
  name,
  setShowMenu,
  setHoveredIndex,
  clapOptimisticState,
  toggleClapAction,
  setReplayId,
}: RankingMenuProps) => {
  const { gameStateRef } = useRefs();
  const { data: session } = useSession();
  const theme: ThemeColors = useTheme();
  const scene = useSceneAtom();

  const handleReplayClick = (name: string, resultId: number) => {
    setShowMenu(null);
    setHoveredIndex(null);
    gameStateRef.current!.replay.userName = name;
    gameStateRef.current!.playMode = "replay";
    setReplayId(resultId);
  };
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
        display="flex"
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
        onClick={() => handleReplayClick(name, resultId)}
        isDisabled={scene === "playing" || scene === "replay" || scene === "practice"}
      >
        リプレイ再生
      </Button>
      {session?.user.id ? (
        <MenuClapButton
          resultId={resultId}
          clapOptimisticState={clapOptimisticState}
          toggleClapAction={toggleClapAction}
        />
      ) : null}
    </Stack>
  );
};

export default RankingMenu;
