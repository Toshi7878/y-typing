"use client";
import React, { useEffect, useRef } from "react";
import Playing from "./scene/Playing";
import End from "./scene/End";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  isHoverDrawerLabelAtom,
  lineSelectIndexAtom,
  mapAtom,
  sceneAtom,
  tabIndexAtom,
} from "../../(atoms)/gameRenderAtoms";
import Ready from "./scene/Ready";
import { Box, Card, useDisclosure } from "@chakra-ui/react";
import { PlayingRef } from "../../(ts)/type";
import ResultDrawer from "./scene/result/ResultDrawer";
import PlayingTop from "./scene/child/PlayingTop";
import PlayingBottom from "./scene/child/PlayingBottom";
import { PlayingLineTimeRef } from "./scene/playing-child/child/PlayingLineTime";
import { PlayingTotalTimeRef } from "./scene/playing-child/child/PlayingTotalTime";
import { SkipGuideRef } from "./scene/playing-child/child/PlayingSkipGuide";
import PracticeLineCard from "./scene/playing-child/PracticeLineCard";

export const Scene = () => {
  const scene = useAtomValue(sceneAtom);
  const map = useAtomValue(mapAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isHovering, setIsHovering] = useAtom(isHoverDrawerLabelAtom);
  const lineSelectIndex = useAtomValue(lineSelectIndexAtom);
  const lineProgressRef = useRef<HTMLProgressElement | null>(null);
  const playingLineTimeRef = useRef<PlayingLineTimeRef>(null);
  const totalTimeProgressRef = useRef<HTMLProgressElement | null>(null);
  const playingTotalTimeRef = useRef<PlayingTotalTimeRef>(null);
  const skipGuideRef = useRef<SkipGuideRef>(null);
  useEffect(() => {
    if (isHovering) {
      onOpen();
    }

    if (isOpen) {
      setIsHovering(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovering, isOpen]);
  const setTabIndex = useSetAtom(tabIndexAtom);
  const playingRef = useRef<PlayingRef>(null);

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
            ref={playingRef}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            playingTotalTimeRef={playingTotalTimeRef}
            skipGuideRef={skipGuideRef}
            totalTimeProgressRef={totalTimeProgressRef}
          />

          {isOpen && <ResultDrawer isOpen={isOpen} onClose={onClose} />}
          {lineSelectIndex !== null && <PracticeLineCard />}

          {map!.mapData[0].options?.eternalCSS && (
            <style>{map!.mapData[0].options?.eternalCSS}</style>
          )}
        </>
      ) : scene === "end" ? (
        <>
          <End onOpen={onOpen} />

          {isOpen && <ResultDrawer isOpen={isOpen} onClose={onClose} />}

          <style>{map!.mapData[0].options?.eternalCSS}</style>
        </>
      ) : null}
      <PlayingBottom
        skipGuideRef={skipGuideRef}
        totalTimeProgressRef={totalTimeProgressRef}
        playingTotalTimeRef={playingTotalTimeRef}
      />
    </Box>
  );
};

function SceneWrapper() {
  console.log("SceneWrapper");

  return (
    <Card
      className="typing-card"
      variant={"filled"}
      bg="type.card.bg"
      color={"type.card.color"}
      boxShadow="lg"
    >
      <Scene />
    </Card>
  );
}

export default SceneWrapper;
