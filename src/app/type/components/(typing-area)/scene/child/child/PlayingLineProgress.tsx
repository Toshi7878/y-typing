import { Box } from "@chakra-ui/react";
import React, { forwardRef, memo } from "react";

const PlayingLineProgress = forwardRef<HTMLProgressElement>((props, ref) => {
  console.log("render Progress");
  return (
    <Box p="2" className="text-xl" display="inline">
      <progress ref={ref as React.LegacyRef<HTMLProgressElement>} className="w-full" />
    </Box>
  );
});

PlayingLineProgress.displayName = "LineProgress";

export default memo(PlayingLineProgress);
