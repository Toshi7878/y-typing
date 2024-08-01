import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import PlayingTop from "./child/PlayingTop";
import { useEffect, useRef, useState } from "react";
import PlayingBottom from "./child/PlayingBottom";
import ReadyInputModeRadioCards from "./child/ReadyInputModeRadioCards";
import ReadyPlaySpeed from "./child/ReadyPlaySpeed";
import "../../../style/fKey.scss";
import ReadyPracticeButton from "./child/ReadyPracticeButton";
import { PlayingLineTimeRef } from "./child/child/PlayingLineTime";
import { useRefs } from "@/app/type/(contexts)/refsProvider";
import EndTypingResultModal from "./child/EndTypingResultModal";

function Ready() {
  const lineProgressRef = useRef<HTMLProgressElement | null>(null);
  const PlayingRemainTimeRef = useRef<PlayingLineTimeRef>(null);
  const totalTimeProgressRef = useRef(null);
  const skipGuideRef = useRef(null);
  const playingTotalTimeRef = useRef(null);
  const { playerRef } = useRefs();
  const speedUpButtonRef = useRef<HTMLButtonElement>(null);
  const speedDownButtonRef = useRef<HTMLButtonElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "Enter":
          if (playerRef.current) {
            playerRef.current.playVideo();
          }
          event.preventDefault();
          break;
        case "F9":
          speedDownButtonRef.current?.click();
          event.preventDefault();

          break;
        case "F10":
          speedUpButtonRef.current?.click();
          event.preventDefault();

          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerRef]);

  return (
    <Box display="flex" flexDirection="column">
      <PlayingTop lineProgressRef={lineProgressRef} PlayingRemainTimeRef={PlayingRemainTimeRef} />
      <Box className="mx-12 mt-2" flex="1">
        <Box className="font-bold text-2xl">Enterキー / 動画をクリックして開始</Box>
        <Flex className="text-3xl text-center mt-6" justifyContent={"center"}>
          <ReadyInputModeRadioCards />
        </Flex>
        <Flex className=" text-center mt-10" justifyContent="space-between">
          <ReadyPlaySpeed
            speedUpButtonRef={speedUpButtonRef}
            speedDownButtonRef={speedDownButtonRef}
          />
          <ReadyPracticeButton onOpen={onOpen} />
        </Flex>
      </Box>
      <PlayingBottom
        skipGuideRef={skipGuideRef}
        totalTimeProgressRef={totalTimeProgressRef}
        playingTotalTimeRef={playingTotalTimeRef}
      />
    </Box>
  );
}

export default Ready;
