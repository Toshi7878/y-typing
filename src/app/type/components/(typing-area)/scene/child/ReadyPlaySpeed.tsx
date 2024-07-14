import { speedAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { useRefs } from "@/app/type/(contexts)/refsProvider";
import { YTSpeedController } from "@/app/type/(ts)/ytHandleEvents";
import { Box, Button, HStack } from "@chakra-ui/react";
import { useAtom } from "jotai";
import React from "react";

const ReadyPlaySpeed = () => {
  const [speedData, setSpeedData] = useAtom(speedAtom);
  const { playerRef } = useRefs();

  return (
    <HStack
      style={{ border: "1px solid black" }}
      px={8}
      py={6}
      className="rounded-lg"
      boxShadow="md"
    >
      <Box>
        <button
          type="button"
          className="text-cyan-400 cursor-pointer"
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
        </button>
      </Box>

      <Box className="font-bold mx-8 text-4xl">
        <span id="speed">{speedData.playSpeed.toFixed(2)}</span>倍速
      </Box>

      <Box>
        <button
          type="button"
          className="text-cyan-400 cursor-pointer"
          onClick={() => {
            new YTSpeedController("up", { speedData, setSpeedData, playerRef: playerRef!.current });
          }}
        >
          <Box className="relative text-3xl" style={{ top: "4px" }}>
            +<small className="f-key">F10</small>
          </Box>
        </button>
      </Box>
    </HStack>
  );
};

export default ReadyPlaySpeed;
