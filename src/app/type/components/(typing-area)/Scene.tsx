import React, { useEffect, useRef } from "react";
import Playing from "./scene/Playing";
import End from "./scene/End";
import { useAtomValue, useSetAtom } from "jotai";
import { mapAtom, sceneAtom, tabIndexAtom } from "../../(atoms)/gameRenderAtoms";
import Ready from "./scene/Ready";
import { Card } from "@chakra-ui/react";
import { PlayingRef } from "../../(ts)/type";

export const Scene = () => {
  const scene = useAtomValue(sceneAtom);
  const map = useAtomValue(mapAtom);

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
    return <Playing ref={playingRef} />;
  } else if (scene === "end") {
    return <End />;
  }
};

function SceneWrapper() {
  console.log("SceneWrapper");

  return (
    <Card className="typing-card" variant={"filled"} bg="blue.100" boxShadow="lg">
      <Scene />
    </Card>
  );
}

export default SceneWrapper;
