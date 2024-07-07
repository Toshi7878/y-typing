import { lyricsAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { Box, Heading, Stack, VStack } from "@chakra-ui/react";
import { useAtom } from "jotai";
import React, { forwardRef, memo, useImperativeHandle, useState } from "react";
// export interface LyricsHandle {
//   setLyrics: (lyrics: string) => void;
// }
interface NextLyricsProps {
  lyrics: string;
  className?: string;
  size?: string;
  kpm: string;
}

const NextLyrics = memo(({ className = "", lyrics, kpm }: NextLyricsProps) => {
  return (
    <Box className={`${className} -indent-4`}>
      <Box
        id="next_lyrics"
        className="font-bold text-xl"
        dangerouslySetInnerHTML={{
          __html: `<ruby class="invisible">あ<rt>あ<rt></ruby>${lyrics}`,
        }}
      />
      <Box id="next_kpm" className="ml-5">
        {Number(kpm) > 0 ? `NEXT: ${kpm}kpm` : ""}
      </Box>
    </Box>
  );
});
NextLyrics.displayName = "NextLyrics";

export default NextLyrics;
