import { playingNotifyAtom } from "@/app/type/(atoms)/gameRenderAtoms";

import { Box } from "@chakra-ui/react";
import { useAtom } from "jotai";

import React, { useEffect, useState } from "react";

interface PlayingNotifyProps {
  className?: string;
}

const PlayingNotify = ({ className = "" }: PlayingNotifyProps) => {
  const [notify, setNotify] = useAtom(playingNotifyAtom);

  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    if (notify !== "ll") {
      setAnimationClass("animate-fade-out");
    }

    const timer = setTimeout(() => {
      if (notify !== "ll") {
        setNotify("");
      }
      setAnimationClass("");
    }, 1000);

    return () => clearTimeout(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notify]);

  return <Box className={`${className} ${animationClass}`}>{notify}</Box>;
};

export default PlayingNotify;
