import { useRefs } from "@/app/type/type-contexts/refsProvider";
import { Box, useTheme } from "@chakra-ui/react";
import React, { forwardRef, memo, useEffect } from "react";

interface PlayingLineProgressProps {
  id: string;
}
const PlayingLineProgress = forwardRef<HTMLProgressElement, PlayingLineProgressProps>(
  (props, ref) => {
    const { setRef } = useRefs();
    const theme = useTheme();

    useEffect(() => {
      if (props.id === "line_progress") {
        if (ref && "current" in ref) {
          setRef("lineProgressRef", ref.current!);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <>
        <Box>
          <progress
            id={props.id}
            ref={ref as React.LegacyRef<HTMLProgressElement>}
            className="w-full"
          />
        </Box>
        <style>
          {`#${props.id}::-webkit-progress-value {
            background: ${theme.colors.type.progress.bg};
              border-radius: 5px;
            }`}
        </style>
      </>
    );
  },
);

PlayingLineProgress.displayName = "LineProgress";

export default memo(PlayingLineProgress);
