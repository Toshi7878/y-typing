import { useRefs } from "@/app/type/type-contexts/refsProvider";
import { Box, Text } from "@chakra-ui/react";
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
    }, [remainTime, lineKpm]);

    useImperativeHandle(ref, () => ({
      getRemainTime: () => remainTime,
      getLineKpm: () => lineKpm,
      setRemainTime: (newRemainTime) => setRemainTime(newRemainTime),
      setLineKpm: (newLineKpm) => setLineKpm(newLineKpm),
    }));

    return (
      <Box className={className}>
        {lineKpm.toFixed(0)}
        <Text as="span" ms={1} letterSpacing="1.5px">
          kpm
        </Text>
        <Text as="span" mx={3}>
          -
        </Text>
        残り
        <Text as="span" me={1}>
          {remainTime.toFixed(1)}
        </Text>
        秒
      </Box>
    );
  },
);

PlayingLineTime.displayName = "PlayingLineTime";

export default PlayingLineTime;
