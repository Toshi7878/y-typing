import { Box, useBreakpointValue } from "@chakra-ui/react";
import { HOME_THUBNAIL_HEIGHT, HOME_THUBNAIL_WIDTH } from "../../../app/(home)/ts/const/consts";

const SkeletonThumbnail = () => {
  const width = useBreakpointValue(HOME_THUBNAIL_WIDTH);
  const height = useBreakpointValue(HOME_THUBNAIL_HEIGHT);
  return (
    <Box
      position="relative"
      className="group"
      minW={width}
      minH={height}
      style={{ userSelect: "none" }}
    >
      <Box width={width} height={height} minW={width} minH={height} rounded="md" />
    </Box>
  );
};

export default SkeletonThumbnail;
