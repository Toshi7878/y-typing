import { useRefs } from "@/app/type/type-contexts/refsProvider";

import { Box } from "@chakra-ui/react";
import React, { memo, useState, forwardRef, useImperativeHandle, useEffect } from "react";

interface PlayingComboProps {
  className?: string;
}

export interface PlayingComboRef {
  getCombo: () => number;
  setCombo: (newCombo: number) => void;
}
const PlayingCombo = forwardRef<PlayingComboRef, PlayingComboProps>(({ className = "" }, ref) => {
  const [combo, setCombo] = useState(0);
  useEffect(() => {
    if (ref && "current" in ref) {
      setRef("playingComboRef", ref.current!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combo]);

  const { setRef } = useRefs();
  useImperativeHandle(ref, () => ({
    getCombo: () => combo,
    setCombo: (newCombo) => {
      setCombo(newCombo);
    },
  }));

  return <Box className={className}>{combo}</Box>;
});

PlayingCombo.displayName = "PlayingCombo";

export default memo(PlayingCombo);
