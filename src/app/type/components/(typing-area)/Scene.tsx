import React from "react";
import Playing from "./scene/Playing";
import End from "./scene/End";
import { useAtom } from "jotai";
import { sceneAtom } from "../../(atoms)/gameRenderAtoms";
import Ready from "./scene/Ready";
import { Box, Card } from "@chakra-ui/react";

export const Scene = () => {
  const [scene] = useAtom(sceneAtom);

  if (scene === "ready") {
    return <Ready />;
  } else if (scene === "playing") {
    return <Playing />;
  } else if (scene === "end") {
    return <End />;
  }
};

function SceneWrapper() {
  console.log("SceneWrapper");

  return (
    <Box w="full" mt="8" h="calc(100vh - 400px)">
      <Card variant={"filled"} bg="blue.100" h="full" borderColor="black">
        <Scene />
      </Card>
    </Box>
  );
}

export default SceneWrapper;
