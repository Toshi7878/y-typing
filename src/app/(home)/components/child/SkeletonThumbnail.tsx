import { Box, useBreakpointValue } from "@chakra-ui/react";
import { THUBNAIL_HEIGHT, THUBNAIL_WIDTH } from "../../ts/const/consts";

const SkeletonThumbnail = () => {
  const width = useBreakpointValue(THUBNAIL_WIDTH);
  const height = useBreakpointValue(THUBNAIL_HEIGHT);
  return (
    <Box className="relative group" width={width} style={{ userSelect: "none" }}>
      <Box width={width} height={height} minW={width} minH={height} className="rounded-md" />
    </Box>
  );
};

export default SkeletonThumbnail;
