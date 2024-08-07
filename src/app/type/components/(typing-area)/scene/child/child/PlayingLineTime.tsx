import { useRefs } from "@/app/type/(contexts)/refsProvider";
import { Box } from "@chakra-ui/react";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";

interface PlayingLineTimeProps {
  className?: string;
}

export interface PlayingLineTimeRef {
  getRemainTime: () => number;
  getLineKpm: () => number;
  setRemainTime: (newRemainTime: number) => void;
  setLineKpm: (newLineKpm: number) => void;
}

const PlayingLineTime = forwardRef<PlayingLineTimeRef, PlayingLineTimeProps>(
  ({ className = "" }, ref) => {
    const [remainTime, setRemainTime] = useState(0);
    const [lineKpm, setLineKpm] = useState(0);

    const { setRef } = useRefs();

    useEffect(() => {
      if (ref && "current" in ref) {
        setRef("playingLineTimeRef", ref.current!);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(ref, () => ({
      getRemainTime: () => remainTime,
      getLineKpm: () => lineKpm,
      setRemainTime: (newRemainTime) => setRemainTime(newRemainTime),
      setLineKpm: (newLineKpm) => setLineKpm(newLineKpm),
    }));

    return (
      <Box className={className}>
        {lineKpm.toFixed(0)}kpm - 残り{remainTime.toFixed(1)}秒
      </Box>
    );
  },
);

PlayingLineTime.displayName = "PlayingLineTime";

export default PlayingLineTime;
