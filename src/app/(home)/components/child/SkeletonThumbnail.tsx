import { Box, useBreakpointValue } from "@chakra-ui/react";

const SkeletonThumbnail = () => {
  const thubnailWidth = { base: 120, sm: 170, xl: 200 };
  const thubnailHeight = { base: (120 * 9) / 16, sm: (170 * 9) / 16, xl: (200 * 9) / 16 };

  const width = useBreakpointValue(thubnailWidth);
  const height = useBreakpointValue(thubnailHeight);
  return (
    <Box className="relative group" width={width} style={{ userSelect: "none" }}>
      <Box width={width} height={height} minW={width} minH={height} className="rounded-md" />
    </Box>
  );
};

export default SkeletonThumbnail;
