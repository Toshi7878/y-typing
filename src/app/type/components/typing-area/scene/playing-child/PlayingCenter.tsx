import { useRefs } from "@/app/type/type-contexts/refsProvider";
import "@/css/type.css";
import { VStack } from "@chakra-ui/react";
import { CARD_BODY_MIN_HEIGHT } from "../../TypingCard";
import PlayingChangeCSS from "./child/PlayingChangeCSS";
import PlayingLyrics from "./child/PlayingLyrics";
import NextLyrics from "./child/PlayingNextLyrics";
import PlayingTypingWords from "./child/PlayingTypingWords";

interface PlayingCenterProps {
  flex: string;
}

const PlayingCenter = ({ flex }: PlayingCenterProps) => {
  const { gameStateRef } = useRefs();

  const playMode = gameStateRef.current!.playMode;

  return (
    <VStack
      sx={{ cursor: playMode === "playing" ? "none" : "auto" }}
      flex={flex}
      isTruncated
      ml={-2}
      align="start"
      minH={CARD_BODY_MIN_HEIGHT}
      justifyContent="space-between"
      style={{ userSelect: "none", cursor: "none" }}
      id="typing_scene"
    >
      <PlayingTypingWords />
      <PlayingLyrics />
      <NextLyrics />
      <PlayingChangeCSS />
    </VStack>
  );
};

export default PlayingCenter;
