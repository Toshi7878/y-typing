import { ThemeColors } from "@/types";
import React from "react";

interface NprogressStyleProps {
  theme: ThemeColors;
}

const NprogressStyle = ({ theme }: NprogressStyleProps) => {
  return (
    <style>
      {`#nprogress .bar {
	  background:${theme.colors.type.progress.bg};
  }`}
    </style>
  );
};

export default NprogressStyle;
