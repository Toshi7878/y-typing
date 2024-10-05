import { Flex, Button, useTheme } from "@chakra-ui/react";
import { ThemeColors } from "@/types";
import { useIsLoadWordConvertAtom } from "@/app/edit/edit-atom/editAtom";
import {
  useIsAddButtonDisabled,
  useIsConvertButtonDisabled,
  useIsDeleteButtonDisabled,
  useIsUpdateButtonDisabled,
  useLineAddButtonEvent,
  useLineDelete,
  useLineUpdateButtonEvent,
  useWordConvertButtonEvent,
} from "@/app/edit/hooks/useEditorButtonEvents";
import React from "react";

const EditorButtons = () => {
  const theme: ThemeColors = useTheme();

  const isAddButtonDisabled = useIsAddButtonDisabled();
  const isUpdateButtonDisabled = useIsUpdateButtonDisabled();
  const isConvertButtonDisabled = useIsConvertButtonDisabled();
  const isDeleteButtonDisabled = useIsDeleteButtonDisabled();

  const lineAddButtonEvent = useLineAddButtonEvent();
  const lineUpdateButtonEvent = useLineUpdateButtonEvent();
  const wordConvertButtonEvent = useWordConvertButtonEvent();
  const lineDelete = useLineDelete();

  const isLoadWordConvert = useIsLoadWordConvertAtom();

  const buttonConfigs = {
    add: {
      isDisabled: isAddButtonDisabled,
      colorScheme: theme.colors.edit.mapTable.currentTimeLine.bg,
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => lineAddButtonEvent(event.shiftKey),
      text: (
        <>
          追加<small className="hidden sm:inline">(S)</small>
        </>
      ),
      isLoading: false,
    },
    update: {
      isDisabled: isUpdateButtonDisabled,
      colorScheme: theme.colors.edit.mapTable.selectedLine.bg,
      onClick: lineUpdateButtonEvent,
      text: (
        <>
          変更<small className="hidden sm:inline">(U)</small>
        </>
      ),
      isLoading: false,
    },
    wordConvert: {
      isDisabled: isConvertButtonDisabled,
      ref: undefined,
      isLoading: isLoadWordConvert,
      colorScheme: theme.colors.edit.mapTable.selectedLine.bg,
      onClick: wordConvertButtonEvent,
      text: "読み変換",
    },
    delete: {
      isDisabled: isDeleteButtonDisabled,
      colorScheme: theme.colors.edit.mapTable.errorLine.bg,
      onClick: lineDelete,
      text: (
        <>
          削除<small className="hidden sm:inline">(Del)</small>
        </>
      ),
      isLoading: false,
    },
  };

  return (
    <Flex gap="3" className="w-[50%] lg:w-[60%] xl:w-[70%]">
      {Object.values(buttonConfigs).map((config, index) => (
        <Button
          key={index}
          isDisabled={config.isDisabled}
          isLoading={config.isLoading}
          variant="outline"
          size="sm"
          height="35px"
          className="w-[50%] lg:w-[60%] xl:w-[70%]"
          color={theme.colors.card.color}
          bg={theme.colors.background}
          _hover={{ bg: `${config.colorScheme}80` }}
          borderColor={config.colorScheme}
          onClick={config.onClick}
          sx={{ colorScheme: config.colorScheme }}
        >
          {config.text}
        </Button>
      ))}
    </Flex>
  );
};

export default EditorButtons;
