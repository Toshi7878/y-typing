import { useRefs } from "@/app/type/(contexts)/refsProvider";
import { Button } from "@chakra-ui/react";
import React from "react";

const ReadyPracticeButton = () => {
  const { gameStateRef, playerRef } = useRefs();
  return (
    <Button
      variant={"outline"}
      borderColor="black"
      px={16}
      py={6}
      size={"xl"}
      className="text-3xl"
      onClick={() => {
        if (gameStateRef.current) {
          gameStateRef.current.practice.isPracticeMode = true;
          playerRef.current.playVideo();
        }
      }}
    >
      練習モードで開始
    </Button>
  );
};

export default ReadyPracticeButton;
