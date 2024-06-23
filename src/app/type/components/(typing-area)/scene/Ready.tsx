import { Box } from "@chakra-ui/react";
import PlayingTop from "./child/PlayingTop";
import { useRef } from "react";

function Ready() {
  const progressRef = useRef(null);
  return (
    <Box>
      <PlayingTop progressRef={progressRef} />
      <Box>Ready</Box>
    </Box>
  );
}

export default Ready;
