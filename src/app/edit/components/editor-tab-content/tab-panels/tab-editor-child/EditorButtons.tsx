import { Flex, Button, useTheme } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { ThemeColors } from "@/types";
import { RootState } from "@/app/edit/redux/store";
import { EditorButtonsRef } from "@/app/edit/ts/type";
import {
  useIsLoadWordConvertAtom,
  useEditLineSelectedCountAtom,
  useIsLineNotSelectAtom,
} from "@/app/edit/edit-atom/editAtom";
import { useRefs } from "@/app/edit/edit-contexts/refsProvider";
import {
  useLineAddButtonEvent,
  useLineDelete,
  useLineUpdateButtonEvent,
  useWordConvertButtonEvent as useWordConvertButtonEvent,
} from "@/app/edit/hooks/useEditorButtonEvents";

interface EditorButtonsProps {
  isTimeInputValid: boolean;
}
const EditorButtons = forwardRef<EditorButtonsRef, EditorButtonsProps>((props, ref) => {
  const { setRef } = useRefs();
  const theme: ThemeColors = useTheme();

  const selectedLineCount = useEditLineSelectedCountAtom();
  const isLineNotSelect = useIsLineNotSelectAtom();

  const lineAddButtonEvent = useLineAddButtonEvent();
  const lineUpdateButtonEvent = useLineUpdateButtonEvent();
  const wordConvertButtonEvent = useWordConvertButtonEvent();
  const lineDelete = useLineDelete();
  const mapData = useSelector((state: RootState) => state.mapData.value);
  const endAfterLineIndex =
    mapData.length -
    1 -
    mapData
      .slice()
      .reverse()
      .findIndex((line) => line.lyrics === "end");

  const isLoadWordConvert = useIsLoadWordConvertAtom();

  useEffect(() => {
    if (ref && "current" in ref) {
      setRef("editorButtonsRef", ref.current!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addButtonRef = useRef<HTMLButtonElement | null>(null);
  const updateButtonRef = useRef<HTMLButtonElement | null>(null);
  const deleteButtonRef = useRef<HTMLButtonElement | null>(null);
  const isLastLineSelected = selectedLineCount === endAfterLineIndex;

  const buttonConfigs = {
    add: {
      isDisabled: !props.isTimeInputValid,
      colorScheme: theme.colors.edit.mapTable.currentTimeLine.bg,
      ref: addButtonRef,
      onClick: lineAddButtonEvent,
      text: (
        <>
          追加<small className="hidden sm:inline">(S)</small>
        </>
      ),
      isLoading: false,
    },
    update: {
      isDisabled: !props.isTimeInputValid || isLineNotSelect || isLastLineSelected,
      ref: updateButtonRef,

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
      isDisabled: isLastLineSelected,
      ref: undefined,
      isLoading: isLoadWordConvert,
      colorScheme: theme.colors.edit.mapTable.selectedLine.bg,
      onClick: wordConvertButtonEvent,
      text: "読み変換",
    },
    delete: {
      isDisabled: !props.isTimeInputValid || isLineNotSelect || isLastLineSelected,
      ref: deleteButtonRef,

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

  useImperativeHandle(ref, () => ({
    add: () => {
      addButtonRef.current!.click();
    },
    update: () => {
      updateButtonRef.current!.click();
    },
    delete: () => {
      deleteButtonRef.current!.click();
    },
  }));

  return (
    <Flex gap="3" className="w-[50%] lg:w-[60%] xl:w-[70%]">
      {Object.values(buttonConfigs).map((config, index) => (
        <Button
          key={index}
          ref={config.ref ? config.ref : undefined}
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
});

EditorButtons.displayName = "EditorButtons";

export default EditorButtons;
