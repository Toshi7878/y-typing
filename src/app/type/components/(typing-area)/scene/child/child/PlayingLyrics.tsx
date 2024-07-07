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

const Lyrics = memo(({ size = "lg", className = "", lyrics }: LyricsProps) => {
  return (
    <Box
      id="lyrics"
      className={`${className}`} // マイナスのインデントを追加
      dangerouslySetInnerHTML={{
        __html: `<ruby class="invisible">あ<rt>あ<rt></ruby>${lyrics}`,
      }}
    />
  );
});
Lyrics.displayName = "Lyrics";

export default Lyrics;
