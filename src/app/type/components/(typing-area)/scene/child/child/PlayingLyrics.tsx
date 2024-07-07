import { lyricsAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { Box, Heading } from "@chakra-ui/react";
import { useAtom } from "jotai";
import React, { forwardRef, memo, useImperativeHandle, useState } from "react";
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
    <Heading
      as="h3"
      id="lyrics"
      size={size}
      className={`${className} -indent-4 mb-4`} // マイナスのインデントを追加
      dangerouslySetInnerHTML={{
        __html: `<ruby class="invisible">あ<rt>あ<rt></ruby>${lyrics}`,
      }}
    />
  );
});
Lyrics.displayName = "Lyrics";

export default Lyrics;
