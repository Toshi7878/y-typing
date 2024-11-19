"use client";
import { ThemeColors } from "@/types";
import { useTheme } from "@chakra-ui/react";
import React from "react";

// interface NprogressStyleProps {
//   theme: ThemeColors;
// }

const NprogressStyle = () => {
  const theme: ThemeColors = useTheme();
  return (
    <style>
      {`#nprogress .bar {
	  background:${theme.colors.type.progress.bg};
  }`}
    </style>
  );
};

export default NprogressStyle;
