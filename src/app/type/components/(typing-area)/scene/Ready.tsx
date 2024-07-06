import { Box } from "@chakra-ui/react";
import PlayingTop from "./child/PlayingTop";
import { useRef } from "react";
import PlayingBottom from "./child/PlayingBottom";

function Ready() {
  const progressRef = useRef(null);
  const skipGuideRef = useRef(null);
  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <PlayingTop progressRef={progressRef} />
      <Box flex="1">Ready</Box>
      <PlayingBottom skipGuideRef={skipGuideRef} />
    </Box>
  );
}

export default Ready;
