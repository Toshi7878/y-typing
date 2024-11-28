"use client";
import "../../style/type.scss";
import React, { useEffect } from "react";
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
import PracticeLineCard from "./scene/playing-child/PracticeLineCard";
import { ThemeColors } from "@/types";
import { atom, useSetAtom } from "jotai";
import { getTypeAtomStore } from "../../[id]/TypeProvider";

interface TypingCardBodyProps {
  drawerClosure: UseDisclosureReturn;
}

export const CARD_BODY_MIN_HEIGHT = "320px";

const TypingCardBody = (props: TypingCardBodyProps) => {
  const { drawerClosure } = props;
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
          <Playing drawerClosure={drawerClosure} />

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

export const drawerClosureAtom = atom<UseDisclosureReturn | null>(null);
const typeAtomStore = getTypeAtomStore();

export const useSetDrawerClosureAtom = () => {
  return useSetAtom(drawerClosureAtom, { store: typeAtomStore });
};

function TypingCard() {
  const theme: ThemeColors = useTheme();
  const drawerClosure = useDisclosure();
  const setDrawerClosure = useSetDrawerClosureAtom();

  useEffect(() => {
    setDrawerClosure(drawerClosure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerClosure]);
  return (
    <Card
      className="typing-card"
      variant={"filled"}
      bg={theme.colors.background.card}
      color={theme.colors.text.body}
      boxShadow="lg"
    >
      <CardHeader py={0} mx={3}>
        <PlayingTop />
      </CardHeader>
      <TypingCardBody drawerClosure={drawerClosure} />
      <CardFooter py={0} mx={3} flexDirection="column">
        <PlayingBottom />
      </CardFooter>
    </Card>
  );
}

export default TypingCard;
