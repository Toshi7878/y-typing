import { lineKpmAtom, remainTimeAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { Box } from "@chakra-ui/react";
import { useAtom } from "jotai";
import React from "react";

const PlayingLineTime = () => {
  const [remainTime] = useAtom(remainTimeAtom);
  const [lineKpm] = useAtom(lineKpmAtom);
  return (
    <Box>
      {lineKpm}kpm - 残り{remainTime}秒
    </Box>
  );
};

export default PlayingLineTime;
