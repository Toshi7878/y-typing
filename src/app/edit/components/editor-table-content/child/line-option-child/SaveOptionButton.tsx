"use client";
import { useSetCanUploadAtom } from "@/app/edit/edit-atom/editAtom";
import { setLineOption } from "@/app/edit/redux/mapDataSlice";
import { ThemeColors } from "@/types";
import { Box, Button, useTheme } from "@chakra-ui/react";
import { Dispatch } from "react";
import { useDispatch } from "react-redux";

interface SaveOptionButtonProps {
  onClose: () => void;
  optionModalIndex: number | null;
  changeCSS: string;
  eternalCSS: string;
  isEditedCSS: boolean;
  setIsEditedCSS: Dispatch<boolean>;
}

export default function SaveOptionButton(props: SaveOptionButtonProps) {
  const { changeCSS, eternalCSS, optionModalIndex, onClose, isEditedCSS, setIsEditedCSS } = props;
  const theme: ThemeColors = useTheme();
  const dispatch = useDispatch();
  const setCanUpload = useSetCanUploadAtom();

  const handleBtnClick = () => {
    dispatch(setLineOption({ options: { changeCSS, eternalCSS }, number: optionModalIndex }));
    setCanUpload(true);
    setIsEditedCSS(false);
    onClose();
  };

  return (
    <Box display="flex" justifyContent="flex-end">
      <Button colorScheme="teal" onClick={handleBtnClick}>
        CSSオプションを保存
      </Button>
    </Box>
  );
}
