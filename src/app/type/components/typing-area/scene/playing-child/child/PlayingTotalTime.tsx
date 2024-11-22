import { useMapAtom, useTypePageSpeedAtom } from "@/app/type/type-atoms/gameRenderAtoms";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import { Box } from "@chakra-ui/react";
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
    const { ytStateRef } = useRefs();
    const [currentTimeSSMM, setCurrentTimeSSMM] = useState(0);
    const map = useMapAtom();
    const speedData = useTypePageSpeedAtom();

    useImperativeHandle(ref, () => ({
      getCurrentTime: () => currentTimeSSMM,
      setCurrentTime: (newCurrentTime: number) => setCurrentTimeSSMM(newCurrentTime),
    }));

    const movieDuration = ytStateRef.current!.movieDuration;
    const duration =
      Number(map?.movieTotalTime) > movieDuration ? movieDuration : map?.movieTotalTime;
    const totalTime = formatTime(map ? Number(duration) / speedData.playSpeed : 0);

    return (
      <Box className={className} id="movie_time">
        <span id="current_time">{formatTime(currentTimeSSMM)}</span> /{" "}
        <span id="total_time">{totalTime}</span>
      </Box>
    );
  },
);

PlayingTotalTime.displayName = "PlayingTotalTime";

export default PlayingTotalTime;
