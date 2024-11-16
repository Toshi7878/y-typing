"use client";
import { toggleClapServerAction } from "@/config/server-actions/toggle-clap-server-action";
import { INITIAL_STATE } from "@/config/consts";
import { ThemeColors, UploadResult } from "@/types";
import { Box, Button, Flex, Text, useTheme } from "@chakra-ui/react";
import { useState } from "react";
import { useFormState } from "react-dom";
import { FaHandsClapping } from "react-icons/fa6";
interface ResultClapButtonProps {
  resultId: number;
  clapCount: number;
  hasClap: boolean;
}

function ResultClapButton({ resultId, clapCount, hasClap }: ResultClapButtonProps) {
  const theme: ThemeColors = useTheme();
  const [localHasClap, setLocalHasClap] = useState(hasClap);
  const [localClapCount, setLocalClapCount] = useState(clapCount);

  const toggleClapAction = (state: UploadResult): Promise<UploadResult> => {
    // 楽観的UI更新
    const newHasClap = !localHasClap;
    const newClapCount = newHasClap ? localClapCount + 1 : localClapCount - 1;
    setLocalHasClap(newHasClap);
    setLocalClapCount(newClapCount);

    try {
      return toggleClapServerAction(resultId);
    } catch (error) {
      // エラーが発生した場合、元の状態に戻す
      setLocalHasClap(localHasClap);
      setLocalClapCount(localClapCount);
      return Promise.reject(error); // エラーを返す
    }
  };

  const [state, formAction] = useFormState(toggleClapAction, INITIAL_STATE);

  return (
    <Box as="form" action={formAction} display="inline-flex">
      <Button
        mx={5}
        px={7}
        rounded={50}
        background={localHasClap ? "#ffb62531" : "transparent"}
        _hover={{
          bg: "#ffb6251c",
          color: "#ffb825",
        }}
        color={localHasClap ? "#ffb825" : "white"}
        cursor="pointer"
        borderColor={theme.colors.card.borderColor}
        border={"1px"}
        size="sm"
        type="submit"
      >
        <Flex alignItems="center" letterSpacing={1}>
          <FaHandsClapping />
          <Text as="span" ml={1}>
            ×{localClapCount}
          </Text>
        </Flex>
      </Button>
    </Box>
  );
}

export default ResultClapButton;
