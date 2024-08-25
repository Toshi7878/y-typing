import { mapAtom, speedAtom } from "@/app/type/type-atoms/gameRenderAtoms";
import { Box } from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";
import React, { forwardRef, useImperativeHandle, useState } from "react";

interface TotalTimeProps {
  className?: string;
}

export interface PlayingTotalTimeRef {
  getCurrentTime: () => number;
  setCurrentTime: (newCurrentTime: number) => void;
}

const formatTime = (time: number): string => {
  const MM = ("00" + parseInt((time / 60).toString())).slice(-2);
  const SS = ("00" + parseInt((time % 60).toString())).slice(-2);

  return `${MM}:${SS}`;
};

const PlayingTotalTime = forwardRef<PlayingTotalTimeRef, TotalTimeProps>(
  ({ className = "" }, ref) => {
    const [currentTimeSSMM, setCurrentTimeSSMM] = useState(0);
    const map = useAtomValue(mapAtom);
    const speedData = useAtomValue(speedAtom);

    useImperativeHandle(ref, () => ({
      getCurrentTime: () => currentTimeSSMM,
      setCurrentTime: (newCurrentTime: number) => setCurrentTimeSSMM(newCurrentTime),
    }));

    const totalTime = formatTime(map ? map.movieTotalTime / speedData.playSpeed : 0);

    return (
      <Box className={className}>
        <span id="current_time">{formatTime(currentTimeSSMM)}</span> /{" "}
        <span id="total_time">{totalTime}</span>
      </Box>
    );
  },
);

PlayingTotalTime.displayName = "PlayingTotalTime";

export default PlayingTotalTime;
