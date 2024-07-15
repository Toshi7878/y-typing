import { lineKpmAtom, remainTimeAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { Box } from "@chakra-ui/react";
import { useAtom } from "jotai";
import React from "react";

interface PlayingLineTimeProps {
  className?: string;
}
const PlayingLineTime = ({ className = "" }: PlayingLineTimeProps) => {
  const [remainTime] = useAtom(remainTimeAtom);
  const [lineKpm] = useAtom(lineKpmAtom);
  return (
    <Box className={className}>
      {lineKpm}kpm - 残り{remainTime.toFixed(1)}秒
    </Box>
  );
};

export default PlayingLineTime;
