import { lyricsAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { Box, Heading, Stack } from "@chakra-ui/react";
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

const NextLyrics = memo(({ size = "lg", className = "", lyrics, kpm }: NextLyricsProps) => {
  return (
    <Stack spacing={3}>
      <Heading
        as="h3"
        id="next_lyrics"
        size={size}
        className={`${className} -indent-4`} // マイナスのインデントを追加
        dangerouslySetInnerHTML={{
          __html: `<ruby class="invisible">あ<rt>あ<rt></ruby>${lyrics}`,
        }}
      />
      <Box id="next_kpm">{Number(kpm) > 0 ? `NEXT: ${kpm}kpm` : ""}</Box>
    </Stack>
  );
});
NextLyrics.displayName = "NextLyrics";

export default NextLyrics;
