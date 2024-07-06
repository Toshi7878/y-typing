import React, { useEffect } from "react";
import Playing from "./scene/Playing";
import End from "./scene/End";
import { useAtom } from "jotai";
import { mapAtom, sceneAtom } from "../../(atoms)/gameRenderAtoms";
import Ready from "./scene/Ready";
import { Box, Card } from "@chakra-ui/react";
import { TabStatusRef } from "../(tab)/tab/TabStatus";

interface SceneProps {
  tabStatusRef: React.RefObject<TabStatusRef>;
}

export const Scene = ({ tabStatusRef }: SceneProps) => {
  const [scene, setScene] = useAtom(sceneAtom);
  const [map] = useAtom(mapAtom);

  if (scene === "ready") {
    return <Ready />;
  } else if (scene === "playing" && map) {
    return <Playing tabStatusRef={tabStatusRef} />;
  } else if (scene === "end") {
    return <End />;
  }
};

function SceneWrapper({ tabStatusRef }: SceneProps) {
  console.log("SceneWrapper");

  return (
    <Box w="full" mt="8" h="calc(100vh - 400px)">
      <Card variant={"filled"} bg="blue.100" h="full" borderColor="black">
        <Scene tabStatusRef={tabStatusRef} />
      </Card>
    </Box>
  );
}

export default SceneWrapper;
