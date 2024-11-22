import { ThemeColors } from "@/types";
import { Box, useTheme } from "@chakra-ui/react";
import React, { memo } from "react";

interface NextLyricsProps {
  lyrics: string;
  kpm: string;
}

const NextLyrics = memo(({ lyrics, kpm }: NextLyricsProps) => {
  const theme: ThemeColors = useTheme();

  return (
    <Box
      color={`${theme.colors.text.body}99`}
      fontSize="3xl"
      className="lyrics-font"
      lineHeight={10}
      ml={-2}
    >
      <Box
        fontWeight="bold"
        id="next_lyrics"
        className="-indent-3"
        dangerouslySetInnerHTML={{
          __html: `<ruby class="invisible">あ<rt>あ<rt></ruby>${lyrics}`,
        }}
      />
      <Box id="next_kpm" ml={3.5}>
        {Number(kpm) > 0 ? `NEXT: ${kpm}kpm` : ""}
      </Box>
    </Box>
  );
});
NextLyrics.displayName = "NextLyrics";

export default NextLyrics;
