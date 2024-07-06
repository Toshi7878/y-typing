import { playingNotifyAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { Box } from "@chakra-ui/react";
import { useAtom } from "jotai";
import React from "react";

const PlayingNotify = () => {
  const [playingNotify] = useAtom(playingNotifyAtom);

  return (
    <Box fontWeight="bold" fontSize="xl">
      {playingNotify}
    </Box>
  );
};

export default PlayingNotify;
