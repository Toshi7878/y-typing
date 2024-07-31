import { Box, Button, HStack } from "@chakra-ui/react";
import React from "react";

interface ReadyPracticeButtonProps {
  onOpen: () => void;
}
const ReadyPracticeButton = ({ onOpen }: ReadyPracticeButtonProps) => {
  return (
    <Button
      variant={"outline"}
      borderColor="black"
      px={16}
      py={6}
      size={"xl"}
      className="text-3xl"
      onClick={onOpen}
    >
      練習モードで開始
    </Button>
  );
};

export default ReadyPracticeButton;
