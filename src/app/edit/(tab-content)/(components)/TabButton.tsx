import { Button } from "@chakra-ui/react";
import React from "react";

interface ButtonProps {
  colorScheme: string;
  _hover: { bg: string };
  text: string;
  onClick: () => void; // 修正: 余分なコロンを削除
}

const TabButton = ({ colorScheme, _hover, text, onClick }: ButtonProps) => {
  return (
    <Button
      size="sm"
      width="100px"
      height="40px"
      colorScheme={colorScheme}
      _hover={{ _hover }}
      variant="outline"
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default TabButton;
