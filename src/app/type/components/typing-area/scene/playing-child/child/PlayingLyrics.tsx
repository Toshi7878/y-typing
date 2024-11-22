import { Box } from "@chakra-ui/react";
import React, { memo } from "react";

interface LyricsProps {
  lyrics: string;
}

const PlayingLyrics = ({ lyrics }: LyricsProps) => {
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

export default memo(PlayingLyrics);
