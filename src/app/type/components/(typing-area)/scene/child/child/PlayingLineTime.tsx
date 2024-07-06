import { remainTimeAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { Box } from "@chakra-ui/react";
import { useAtom } from "jotai";
import React from "react";

const PlayingLineTime = () => {
  const [remainTime] = useAtom(remainTimeAtom);

  return (
    <Box fontWeight="bold" fontSize="xl">
      0kpm - 残り{remainTime}秒
    </Box>
  );
};

export default PlayingLineTime;
