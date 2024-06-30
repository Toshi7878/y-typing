import { statusAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { Box } from "@chakra-ui/react";
import { useAtom } from "jotai";
import React, { memo } from "react";

const PlayingCombo = ({ comboCount }: { comboCount: number }) => {

  return (
    <Box fontWeight="bold" fontSize="xl">
      {comboCount}
    </Box>
  );
};

export default memo(PlayingCombo);
