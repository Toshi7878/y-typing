import { Box } from "@chakra-ui/react";
import React, { forwardRef, useImperativeHandle, useState } from "react";

export interface SkipGuideRef {
  getSkipGuide: () => string;
  setSkipGuide: (guide: string) => void;
}

interface PlayingSkipGuideProps {
  className?: string;
}

const PlayingSkipGuide = forwardRef<SkipGuideRef, PlayingSkipGuideProps>(
  ({ className = "" }: PlayingSkipGuideProps, ref) => {
    const [skip, setSkipGuide] = useState("");

    useImperativeHandle(ref, () => ({
      getSkipGuide: () => skip,
      setSkipGuide: (guide: string) => setSkipGuide(guide),
    }));

    return <Box className={className}>{skip ? `Type ${skip} key to Skip. ⏩` : ""}</Box>;
  },
);

PlayingSkipGuide.displayName = "PlayingSkipGuide"; // 追加

export default PlayingSkipGuide;
