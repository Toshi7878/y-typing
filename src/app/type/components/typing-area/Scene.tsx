"use client";
import "../../style/type.scss";
import React, { useEffect, useRef } from "react";
import Playing from "./scene/Playing";
import End from "./scene/End";
import {
  useLineSelectIndexAtom,
  useMapAtom,
  useSceneAtom,
  useSetTabIndexAtom,
} from "../../type-atoms/gameRenderAtoms";
import Ready from "./scene/Ready";
import { Box, Card, useDisclosure, useTheme } from "@chakra-ui/react";
import ResultDrawer from "./scene/result/ResultDrawer";
import PlayingTop from "./scene/child/PlayingTop";
import PlayingBottom from "./scene/child/PlayingBottom";
import { PlayingLineTimeRef } from "./scene/playing-child/child/PlayingLineTime";
import { PlayingTotalTimeRef } from "./scene/playing-child/child/PlayingTotalTime";
import { SkipGuideRef } from "./scene/playing-child/child/PlayingSkipGuide";
import PracticeLineCard from "./scene/playing-child/PracticeLineCard";
import { ThemeColors } from "@/types";

export const Scene = () => {
  const scene = useSceneAtom();
  const map = useMapAtom();
  const drawerClosure = useDisclosure();
  const { isOpen, onOpen } = drawerClosure;
  const lineSelectIndex = useLineSelectIndexAtom();
  const lineProgressRef = useRef<HTMLProgressElement | null>(null);
  const playingLineTimeRef = useRef<PlayingLineTimeRef>(null);
  const totalTimeProgressRef = useRef<HTMLProgressElement | null>(null);
  const playingTotalTimeRef = useRef<PlayingTotalTimeRef>(null);
  const skipGuideRef = useRef<SkipGuideRef>(null);
  const setTabIndex = useSetTabIndexAtom();

  useEffect(() => {
    if (isPlayed) {
      setTabIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  const isPlayed = scene === "playing" || scene === "replay" || scene === "practice";
  return (
    <Box display="flex" flexDirection="column" className={isPlayed ? "select-none" : ""}>
      <PlayingTop lineProgressRef={lineProgressRef} PlayingRemainTimeRef={playingLineTimeRef} />
      {scene === "ready" ? (
        <Ready />
      ) : isPlayed && map ? (
        <>
          <Playing
            drawerClosure={drawerClosure}
            playingTotalTimeRef={playingTotalTimeRef}
            skipGuideRef={skipGuideRef}
            totalTimeProgressRef={totalTimeProgressRef}
          />

          {isOpen && <ResultDrawer drawerClosure={drawerClosure} />}
          {lineSelectIndex !== null && scene === "practice" && <PracticeLineCard />}

          {map!.mapData[0].options?.eternalCSS && (
            <style>{map!.mapData[0].options?.eternalCSS}</style>
          )}
        </>
      ) : scene === "end" ? (
        <>
          <End onOpen={onOpen} />

          {isOpen && <ResultDrawer drawerClosure={drawerClosure} />}

          <style>{map!.mapData[0].options?.eternalCSS}</style>
        </>
      ) : null}
      <PlayingBottom
        drawerClosure={drawerClosure}
        skipGuideRef={skipGuideRef}
        totalTimeProgressRef={totalTimeProgressRef}
        playingTotalTimeRef={playingTotalTimeRef}
      />
    </Box>
  );
};

function SceneWrapper() {
  console.log("SceneWrapper");
  const theme: ThemeColors = useTheme();

  return (
    <Card
      className="typing-card"
      variant={"filled"}
      bg={theme.colors.background.card}
      color={"text.body"}
      boxShadow="lg"
    >
      <Scene />
    </Card>
  );
}

export default SceneWrapper;
