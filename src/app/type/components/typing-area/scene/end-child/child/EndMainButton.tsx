import { ThemeColors } from "@/types";
import { Button, useTheme } from "@chakra-ui/react";
import React from "react";
import { useFormStatus } from "react-dom";

interface EndMainButtonProps {
  text: string;
  onClick?: () => void;
  isDisabled?: boolean;
  type?: "button" | "submit" | "reset";
}
const EndMainButton = ({
  text,
  onClick = () => {},
  isDisabled = false,
  type = "button",
}: EndMainButtonProps) => {
  const theme: ThemeColors = useTheme();
  const { pending } = useFormStatus();

  return (
    <Button
      className="cursor-pointer"
      variant="solid"
      py={12}
      width="450px"
      bg={theme.colors.type.progress.bg}
      color={theme.colors.card.color}
      border="1px"
      borderColor={theme.colors.card.borderColor}
      fontSize="3xl"
      onClick={onClick}
      isDisabled={isDisabled}
      isLoading={pending}
      type={type}
      _hover={{
        bg: theme.colors.type.progress.hover.bg,
      }}
    >
      {text}
    </Button>
  );
};

export default EndMainButton;
