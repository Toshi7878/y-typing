import { playingNotifyAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { Box } from "@chakra-ui/react";
import { useAtom } from "jotai";
import React from "react";

interface PlayingNotifyProps {
  className?: string;
}
const PlayingNotify = ({ className = "" }: PlayingNotifyProps) => {
  const [playingNotify] = useAtom(playingNotifyAtom);

  return <Box className={className}>{playingNotify}</Box>;
};

export default PlayingNotify;
