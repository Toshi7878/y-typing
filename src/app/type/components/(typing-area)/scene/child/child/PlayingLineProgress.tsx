import { useRefs } from "@/app/type/(contexts)/refsProvider";
import { Box, Progress } from "@chakra-ui/react";
import React, { forwardRef, memo, useEffect, useImperativeHandle, useState } from "react";

interface PlayingLineProgressProps {
  id: string;
}

interface PlayingProgressRef {
  setValue: (value: number) => void;
  setMaxValue: (value: number) => void;
}
const PlayingLineProgress = forwardRef<PlayingProgressRef, PlayingLineProgressProps>(
  (props, ref) => {
    const { setRef } = useRefs();
    const [progressValue, setProgressValue] = useState(0);
    const [maxValue, setMaxValue] = useState(100);

    useImperativeHandle(ref, () => ({
      setValue: (value: number) => setProgressValue(value),
      setMaxValue: (value: number) => setMaxValue(value),
    }));

    useEffect(() => {
      if (props.id === "line_progress") {
        if (ref && "current" in ref) {
          setRef("lineProgressRef", ref.current!);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <Box>
        <Progress
          id={props.id}
          ref={ref as React.Ref<HTMLDivElement>}
          className="w-full"
          value={progressValue}
          max={maxValue}
          colorScheme="blue"
          size="sm"
        />
      </Box>
    );
  },
);

PlayingLineProgress.displayName = "LineProgress";

export default memo(PlayingLineProgress);
