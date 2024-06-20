import React from "react";
import Playing, { PlayingHandle } from "./scene/Playing";
import End from "./scene/End";
import { useAtom } from "jotai";
import { sceneAtom } from "../../(atoms)/gameRenderAtoms";
import Ready from "./scene/Ready";

import { Box, Card } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { timer } from "../(youtube-content)/timer";
import LineProgress from "./scene/child/LineProgress";
import { ticker, updateFunction } from "../(youtube-content)/youtubeEvents";
import { mapAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { useRefs } from "../../(contexts)/refsProvider";

export const Scene = () => {
  const [scene] = useAtom(sceneAtom);
  const playingSceneRef = useRef<PlayingHandle>(null);

  const { setRef } = useRefs();

  useEffect(() => {
    setRef("playingSceneRef", playingSceneRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  if (scene === "ready") {
    return <Ready />;
  } else if (scene === "playing") {
    return <Playing ref={playingSceneRef} />;
  } else if (scene === "end") {
    return <End />;
  }
};

function SceneWrapper() {
  console.log("SceneWrapper");
  const [map] = useAtom(mapAtom);

  const lineCountRef = useRef(0);
  const progressRef = useRef<HTMLProgressElement>(null);
  const { playingSceneRef } = useRefs();

  useEffect(() => {
    const updateLine = () => {
      if (!map || !playingSceneRef.current) {
        return;
      }
      const count = lineCountRef.current;
      const prevLine = map.data[count - 1];
      const currentLine = map.data[count];
      const nextLine = map.data[count + 1];

      if (nextLine && Number(timer.currentTime) >= Number(currentLine["time"])) {
        lineCountRef.current += 1;
        playingSceneRef.current!.setMainWord({
          correct: "",
          nextChar: "",
          word: map.lineWords[count]["k"].join(""),
        });
        playingSceneRef.current!.setSubWord({
          correct: "",
          nextChar: "",
          word: map.lineWords[count]["r"].join("").toUpperCase(),
        });
        playingSceneRef.current!.setLyrics(currentLine["lyrics"]);
        playingSceneRef.current!.setNextLyrics(nextLine["lyrics"]);
        if (progressRef.current) {
          progressRef.current.max = Number(nextLine["time"]) - Number(currentLine["time"]);
        }
      }

      if (progressRef.current) {
        if (prevLine) {
          progressRef.current!.value = Number(timer.currentTime) - Number(prevLine["time"]);
        } else {
          progressRef.current!.value = Number(timer.currentTime);
        }
      }
    };

    timer.addListener(updateLine);
    return () => {
      timer.removeListener(updateLine);
      ticker.stop();
      ticker.remove(updateFunction);
      const playingScene = playingSceneRef.current;

      if (playingScene) {
        playingSceneRef.current!.setMainWord({
          correct: "",
          nextChar: "",
          word: "",
        });
        playingSceneRef.current!.setSubWord({
          correct: "",
          nextChar: "",
          word: "",
        });
        playingSceneRef.current!.setLyrics("");
        playingSceneRef.current!.setNextLyrics("");
      }
      // クリーンアップ: refのデータをリセット
      const progressElement = progressRef.current;

      lineCountRef.current = 0;

      if (progressElement) {
        progressRef.current.value = 0;

        progressRef.current.max = 0; // maxのリセット
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, playingSceneRef.current]);

  return (
    <Box w="full" mt="8" h="calc(100vh - 400px)">
      <Card variant={"outline"} h="full" borderColor="black">
        <LineProgress ref={progressRef} />
        <Scene />
      </Card>
    </Box>
  );
}

export default SceneWrapper;
