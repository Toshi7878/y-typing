import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import ReadyInputModeRadioCards from "./ready-child/ReadyInputModeRadioCards";
import ReadyPlaySpeed from "./ready-child/ReadyPlaySpeed";
import "../../../style/fKey.scss";
import ReadyPracticeButton from "./ready-child/ReadyPracticeButton";
import { useRefs } from "@/app/type/(contexts)/refsProvider";

function Ready() {
  const { playerRef } = useRefs();
  const speedUpButtonRef = useRef<HTMLButtonElement>(null);
  const speedDownButtonRef = useRef<HTMLButtonElement>(null);

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
        <ReadyPracticeButton />
      </Flex>
    </Box>
  );
}

export default Ready;
