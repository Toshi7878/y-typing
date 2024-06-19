import { Box } from "@chakra-ui/react";
import React, { forwardRef, memo } from "react";

const LineProgress = forwardRef<HTMLProgressElement>((props, ref) => {
  return (
    <Box p="4" className="text-xl" display="inline">
      <progress ref={ref as React.LegacyRef<HTMLProgressElement>} className="w-full" />
    </Box>
  );
});

LineProgress.displayName = "LineProgress";

export default LineProgress;
