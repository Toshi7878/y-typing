import { VStack } from "@chakra-ui/react";
import PlayingLyrics from "./child/PlayingLyrics";
import NextLyrics from "./child/PlayingNextLyrics";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import "@/css/type.css";
import { CARD_BODY_MIN_HEIGHT } from "../../TypingCard";
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
    >
      <PlayingTypingWords />
      <PlayingLyrics />

      <NextLyrics />
    </VStack>
  );
};

export default PlayingCenter;
