import { Box } from "@chakra-ui/react";
import React, { memo } from "react";
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
    <Box className={`${className}`}>
      <Box
        id="next_lyrics"
        className="font-bold -indent-3 ml-[1px]"
        dangerouslySetInnerHTML={{
          __html: `<ruby class="invisible">あ<rt>あ<rt></ruby>${lyrics}`,
        }}
      />
      <Box id="next_kpm" className="ml-4">
        {Number(kpm) > 0 ? `NEXT: ${kpm}kpm` : ""}
      </Box>
    </Box>
  );
});
NextLyrics.displayName = "NextLyrics";

export default NextLyrics;
