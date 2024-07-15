import { Box, Flex } from "@chakra-ui/react";
import PlayingTop from "./child/PlayingTop";
import { useRef } from "react";
import PlayingBottom from "./child/PlayingBottom";
import ReadyInputModeRadioCards from "./child/ReadyInputModeRadioCards";
import ReadyPlaySpeed from "./child/ReadyPlaySpeed";
import "../../../style/fKey.scss";
import ReadyPracticeButton from "./child/ReadyPracticeButton";
import { PlayingLineTimeRef } from "./child/child/PlayingLineTime";

function Ready() {
  const lineProgressRef = useRef<HTMLProgressElement | null>(null);
  const PlayingRemainTimeRef = useRef<PlayingLineTimeRef>(null);
  const totalTimeProgressRef = useRef(null);
  const skipGuideRef = useRef(null);
  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <PlayingTop lineProgressRef={lineProgressRef} PlayingRemainTimeRef={PlayingRemainTimeRef} />
      <Box className="mx-6 mt-2" flex="1">
        <Box className="font-bold text-2xl">Enterキー / 動画をクリックして開始</Box>
        <Flex className="text-3xl text-center mt-6" justifyContent={"center"}>
          <ReadyInputModeRadioCards />
        </Flex>
        <Flex className=" text-center mt-10" justifyContent="space-between">
          <ReadyPlaySpeed />
          <ReadyPracticeButton />
        </Flex>
      </Box>
      <PlayingBottom skipGuideRef={skipGuideRef} totalTimeProgressRef={totalTimeProgressRef} />
    </Box>
  );
}

export default Ready;
