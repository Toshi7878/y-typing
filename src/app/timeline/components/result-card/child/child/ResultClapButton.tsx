"use client";
import { toggleClapServerAction } from "@/components/server-actions/toggle-clap-server-action";
import { INITIAL_STATE } from "@/config/consts";
import { ThemeColors, UploadResult } from "@/types";
import { Badge, Box, Button, Flex, Text, useTheme } from "@chakra-ui/react";
import { useFormState } from "react-dom";
import { FaHandsClapping } from "react-icons/fa6";

interface ResultClapButtonProps {
  resultId: number;
  clapCount: number;
}

function ResultClapButton({ resultId, clapCount }: ResultClapButtonProps) {
  const theme: ThemeColors = useTheme();
  const toggleClapAction = (state: UploadResult): Promise<UploadResult> => {
    console.log("test");
    return toggleClapServerAction(resultId);
  };

  const [state, formAction] = useFormState(toggleClapAction, INITIAL_STATE);

  return (
    <Box as="form" action={formAction} display="inline-flex">
      <Button
        mx={5}
        px={7}
        rounded={50}
        background={"transparent"}
        _hover={{
          bg: "#ffb6251c",
          color: "#ffb825",
        }}
        cursor="pointer"
        borderColor={theme.colors.card.borderColor}
        border={"1px"}
        size="sm"
        type="submit"
      >
        <Flex alignItems="center" letterSpacing={1}>
          <FaHandsClapping />
          <Text as="span" ml={1}>
            ×{clapCount}
          </Text>
        </Flex>
      </Button>
    </Box>
  );
}

export default ResultClapButton;
