"use client";
import "../../style/type.scss";
import React, { RefObject, useEffect, useRef } from "react";
import Playing from "./scene/Playing";
import End from "./scene/End";
import {
  useLineSelectIndexAtom,
  useMapAtom,
  useSceneAtom,
  useSetTabIndexAtom,
} from "../../type-atoms/gameRenderAtoms";
import Ready from "./scene/Ready";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  useDisclosure,
  UseDisclosureReturn,
  useTheme,
} from "@chakra-ui/react";
import ResultDrawer from "./scene/result/ResultDrawer";
import PlayingTop from "./scene/child/PlayingTop";
import PlayingBottom from "./scene/child/PlayingBottom";
import { PlayingLineTimeRef } from "./scene/playing-child/child/PlayingLineTime";
import { PlayingTotalTimeRef } from "./scene/playing-child/child/PlayingTotalTime";
import { SkipGuideRef } from "./scene/playing-child/child/PlayingSkipGuide";
import PracticeLineCard from "./scene/playing-child/PracticeLineCard";
import { ThemeColors } from "@/types";

interface TypingCardBodyProps {
  drawerClosure: UseDisclosureReturn;
  playingTotalTimeRef: RefObject<PlayingTotalTimeRef>;
  skipGuideRef: RefObject<SkipGuideRef>;
  totalTimeProgressRef: RefObject<HTMLProgressElement>;
}

export const CARD_BODY_MIN_HEIGHT = "320px";

const TypingCardBody = (props: TypingCardBodyProps) => {
  const { drawerClosure, playingTotalTimeRef, skipGuideRef, totalTimeProgressRef } = props;
  const scene = useSceneAtom();
  const map = useMapAtom();
  const { isOpen, onOpen } = drawerClosure;
  const lineSelectIndex = useLineSelectIndexAtom();
  const setTabIndex = useSetTabIndexAtom();

  useEffect(() => {
    if (isPlayed) {
      setTabIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  const isPlayed = scene === "playing" || scene === "replay" || scene === "practice";
  return (
    <CardBody mx={8} py={3}>
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
    </CardBody>
  );
};

function TypingCard() {
  const theme: ThemeColors = useTheme();
  const lineProgressRef = useRef<HTMLProgressElement | null>(null);
  const playingLineTimeRef = useRef<PlayingLineTimeRef>(null);
  const drawerClosure = useDisclosure();
  const totalTimeProgressRef = useRef<HTMLProgressElement | null>(null);
  const playingTotalTimeRef = useRef<PlayingTotalTimeRef>(null);
  const skipGuideRef = useRef<SkipGuideRef>(null);

  return (
    <Card
      className="typing-card"
      variant={"filled"}
      bg={theme.colors.background.card}
      color={theme.colors.text.body}
      boxShadow="lg"
    >
      <CardHeader py={0} mx={3}>
        <PlayingTop lineProgressRef={lineProgressRef} PlayingRemainTimeRef={playingLineTimeRef} />
      </CardHeader>
      <TypingCardBody
        drawerClosure={drawerClosure}
        totalTimeProgressRef={totalTimeProgressRef}
        playingTotalTimeRef={playingTotalTimeRef}
        skipGuideRef={skipGuideRef}
      />
      <CardFooter py={0} mx={3} flexDirection="column">
        <PlayingBottom
          drawerClosure={drawerClosure}
          skipGuideRef={skipGuideRef}
          totalTimeProgressRef={totalTimeProgressRef}
          playingTotalTimeRef={playingTotalTimeRef}
        />
      </CardFooter>
    </Card>
  );
}

export default TypingCard;
