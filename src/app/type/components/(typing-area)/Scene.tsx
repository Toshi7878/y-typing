import React, { useEffect } from "react";
import Playing from "./scene/Playing";
import End from "./scene/End";
import { useAtom } from "jotai";
import { mapAtom, sceneAtom, tabIndexAtom } from "../../(atoms)/gameRenderAtoms";
import Ready from "./scene/Ready";
import { Box, Card } from "@chakra-ui/react";
import { TabStatusRef } from "../(tab)/tab/TabStatus";

interface SceneProps {
  tabStatusRef: React.RefObject<TabStatusRef>;
}

export const Scene = ({ tabStatusRef }: SceneProps) => {
  const [scene] = useAtom(sceneAtom);
  const [map] = useAtom(mapAtom);

  const [, setTabIndex] = useAtom(tabIndexAtom);

  useEffect(() => {
    if (scene === "playing") {
      setTabIndex(0);
    }
  }, [scene]);

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
    <Box className="w-full mt-4 overflow-hidden" height="calc(100vh - 400px)">
      <Card variant={"filled"} className="max-h-[92%]" bg="blue.100" boxShadow="lg">
        <Scene tabStatusRef={tabStatusRef} />
      </Card>
    </Box>
  );
}

export default SceneWrapper;
