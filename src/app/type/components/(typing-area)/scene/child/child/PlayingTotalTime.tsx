import { currentTimeSSMMAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { Box } from "@chakra-ui/react";
import { useAtom } from "jotai";
import React from "react";

interface TotalTimeProps {
  totalTime: string;
  className?: string;
}

const formatTime = (time: number): string => {
  const MM = ("00" + parseInt((time / 60).toString())).slice(-2);
  const SS = ("00" + parseInt((time % 60).toString())).slice(-2);

  return `${MM}:${SS}`;
};

const PlayingTotalTime = ({ totalTime, className = "" }: TotalTimeProps) => {
  const [currentTimeSSMM] = useAtom(currentTimeSSMMAtom);

  return (
    <Box className={className}>
      <span id="current_time">{formatTime(currentTimeSSMM)}</span> /{" "}
      <span id="total_time">{totalTime}</span>
    </Box>
  );
};

export default PlayingTotalTime;
