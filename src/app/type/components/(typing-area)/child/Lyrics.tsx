import { lyricsAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { Box, Heading } from "@chakra-ui/react";
import { useAtom } from "jotai";
import React, { forwardRef, memo, useImperativeHandle, useState } from "react";
// export interface LyricsHandle {
//   setLyrics: (lyrics: string) => void;
// }
interface LyricsProps {
  lyrics: string;
}

const Lyrics = memo(({ lyrics }: LyricsProps) => {
  return (
    <Heading
      as="h3"
      size="lg"
      className="indent-0"
      dangerouslySetInnerHTML={{
        __html: `<ruby class="invisible">あ<rt>あ<rt></ruby>${lyrics}`,
      }}
    />
  );
});
Lyrics.displayName = "Lyrics";

export default Lyrics;
