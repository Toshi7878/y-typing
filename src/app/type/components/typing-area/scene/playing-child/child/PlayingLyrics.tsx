import { Box } from "@chakra-ui/react";
import React, { memo } from "react";
// export interface LyricsHandle {
//   setLyrics: (lyrics: string) => void;
// }
interface LyricsProps {
  lyrics: string;
  className?: string;
  size?: string;
}

const PlayingLyrics = memo(({ size = "lg", className = "", lyrics }: LyricsProps) => {
  return (
    <Box
      id="lyrics"
      className={`${className}`}
      dangerouslySetInnerHTML={{
        __html: `<ruby class="invisible">あ<rt>あ<rt></ruby>${lyrics}`,
      }}
    />
  );
});
PlayingLyrics.displayName = "PlayingLyrics";

export default PlayingLyrics;
