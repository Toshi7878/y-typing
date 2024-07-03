import { Box } from "@chakra-ui/react";
import React from "react";

interface TotalTimeProps {
  currentTime: string;
  totalTime: string;
}

const PlayingTotalTime = ({ currentTime, totalTime }: TotalTimeProps) => {
  return (
    <Box fontWeight="bold" fontSize="xl">
      <span id="current_time">{currentTime}</span> / <span id="total_time">{totalTime}</span>
    </Box>
  );
};

export default PlayingTotalTime;
