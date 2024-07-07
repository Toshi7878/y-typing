import { Box } from "@chakra-ui/react";
import React, { forwardRef, memo } from "react";

const PlayingLineProgress = forwardRef<HTMLProgressElement>((props, ref) => {
  console.log("render Progress");
  return (
    <Box>
    <progress ref={ref as React.LegacyRef<HTMLProgressElement>} className="w-full" />
    </Box>
  );
});

PlayingLineProgress.displayName = "LineProgress";

export default memo(PlayingLineProgress);
