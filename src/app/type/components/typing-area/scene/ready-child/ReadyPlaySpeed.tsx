import { useRefs } from "@/app/type/type-contexts/refsProvider";
import { YTSpeedController } from "@/app/type/ts/ytHandleEvents";
import { Box, Button, HStack, useTheme } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { ThemeColors } from "@/types";
import {
  useSetTypePageSpeedAtom,
  useTypePageSpeedAtom,
} from "@/app/type/type-atoms/gameRenderAtoms";
import CustomToolTip from "@/components/custom-chakra-ui/CustomToolTip";

interface ReadyPlaySpeedProps {
  speedUpButtonRef: React.RefObject<HTMLButtonElement>;
  speedDownButtonRef: React.RefObject<HTMLButtonElement>;
}
const ReadyPlaySpeed = (props: ReadyPlaySpeedProps) => {
  const speedData = useTypePageSpeedAtom();
  const setSpeedData = useSetTypePageSpeedAtom();
  const { playerRef, gameStateRef } = useRefs();
  const theme: ThemeColors = useTheme();

  useEffect(() => {
    if (speedData.defaultSpeed < 1) {
      gameStateRef.current!.playMode = "practice";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speedData.defaultSpeed]);

  return (
    <HStack
      borderColor={"border.card"}
      style={{ border: "1px solid" }}
      px={8}
      py={6}
      className="rounded-lg"
      boxShadow="md"
    >
      <CustomToolTip
        tooltipLabel="1.00倍速未満の場合は練習モードになります。"
        placement="top"
        isDisabled={speedData.defaultSpeed > 1}
      >
        <Box>
          <Button
            variant="link"
            colorScheme="cyan"
            ref={props.speedDownButtonRef}
            style={{ textDecoration: "none" }} // 下線非表示
            onClick={() => {
              new YTSpeedController("down", {
                speedData,
                setSpeedData,
                playerRef: playerRef!.current,
              });
            }}
          >
            <Box className="relative text-3xl" style={{ top: "4px" }}>
              -<small className="f-key">F9</small>
            </Box>
          </Button>
        </Box>
      </CustomToolTip>

      <Box className="font-bold mx-8 text-4xl">
        <span id="speed">{speedData.defaultSpeed.toFixed(2)}</span>倍速
      </Box>

      <Box>
        <Button
          variant="link"
          colorScheme="cyan"
          ref={props.speedUpButtonRef}
          style={{ textDecoration: "none" }} // 下線非表示
          onClick={() => {
            new YTSpeedController("up", {
              speedData,
              setSpeedData,
              playerRef: playerRef!.current,
            });
          }}
        >
          <Box className="relative text-3xl" style={{ top: "4px" }}>
            +<small className="f-key">F10</small>
          </Box>
        </Button>
      </Box>
    </HStack>
  );
};

export default ReadyPlaySpeed;
