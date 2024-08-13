import React, { useEffect, useRef } from "react";
import Playing from "./scene/Playing";
import End from "./scene/End";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  isHoverDrawerLabelAtom,
  mapAtom,
  sceneAtom,
  tabIndexAtom,
} from "../../(atoms)/gameRenderAtoms";
import Ready from "./scene/Ready";
import { Card, useDisclosure } from "@chakra-ui/react";
import { PlayingRef } from "../../(ts)/type";
import ResultDrawer from "./scene/child/ResultDrawer";

export const Scene = () => {
  const scene = useAtomValue(sceneAtom);
  const map = useAtomValue(mapAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isHovering, setIsHovering] = useAtom(isHoverDrawerLabelAtom);

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

  const isPlayed = scene === "playing" || scene === "replay" || scene === "practice";

  useEffect(() => {
    if (isPlayed) {
      setTabIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  if (scene === "ready") {
    return <Ready />;
  } else if (isPlayed && map) {
    return (
      <>
        <Playing ref={playingRef} isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        {isOpen && <ResultDrawer isOpen={isOpen} onClose={onClose} />}
        {map!.mapData[0].options?.eternalCSS && (
          <style>{map!.mapData[0].options?.eternalCSS}</style>
        )}
      </>
    );
  } else if (scene === "end") {
    return (
      <>
        <End onOpen={onOpen} />
        {isOpen && <ResultDrawer isOpen={isOpen} onClose={onClose} />}
        <style>{map!.mapData[0].options?.eternalCSS}</style>
      </>
    );
  }
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
