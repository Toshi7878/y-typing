import { Box, Button, HStack } from "@chakra-ui/react";
import React from "react";

const ReadyPlaySpeed = () => {
  return (
    <HStack
      style={{ border: "1px solid black" }}
      px={14}
      py={6}
      className="rounded-lg"
      boxShadow="md"
    >
      <Box>
        <button type="button" className="text-cyan-400 cursor-pointer">
          <Box className="relative text-3xl" style={{ top: "4px" }}>
            -<small className="f-key">F9</small>
          </Box>
        </button>
      </Box>

      <Box className="font-bold mx-4 text-4xl">
        <span id="speed">{(1).toFixed(2)}</span>倍速
      </Box>

      <Box>
        <button type="button" className="text-cyan-400 cursor-pointer">
          <Box className="relative text-3xl" style={{ top: "4px" }}>
            +<small className="f-key">F10</small>
          </Box>
        </button>
      </Box>
    </HStack>
  );
};

export default ReadyPlaySpeed;
