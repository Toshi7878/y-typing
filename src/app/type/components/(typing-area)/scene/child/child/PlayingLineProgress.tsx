import { Box } from "@chakra-ui/react";
import React, { forwardRef, memo } from "react";

const PlayingLineProgress = forwardRef<HTMLProgressElement>((props, ref) => {
  console.log("render Progress");
  return (
    <Box className="text-xl px-2" display="inline">
      <progress ref={ref as React.LegacyRef<HTMLProgressElement>} className="w-[98%]" />
    </Box>
  );
});

PlayingLineProgress.displayName = "LineProgress";

export default memo(PlayingLineProgress);
