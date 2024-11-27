import { useLyricsAtom } from "@/app/type/type-atoms/gameRenderAtoms";
import { Box } from "@chakra-ui/react";
import React from "react";

const PlayingLyrics = () => {
  const lyrics = useLyricsAtom();

  return (
    <Box
      isTruncated
      fontWeight="bold"
      fontSize="2.75rem"
      id="lyrics"
      ml={-8}
      className={"-inset-5 lyrics-font"}
      dangerouslySetInnerHTML={{
        __html: `<ruby class="invisible">あ<rt>あ<rt></ruby>${lyrics}`,
      }}
    />
  );
};
PlayingLyrics.displayName = "PlayingLyrics";

export default PlayingLyrics;
