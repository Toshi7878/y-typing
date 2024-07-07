import { statusAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { Box } from "@chakra-ui/react";
import { useAtom } from "jotai";
import React, { memo } from "react";

interface PlayingComboProps {
  comboCount: number;
  className?: string;
}
const PlayingCombo = ({ comboCount, className = "" }: PlayingComboProps) => {
  return <Box className={className}>{comboCount}</Box>;
};
export default memo(PlayingCombo);
