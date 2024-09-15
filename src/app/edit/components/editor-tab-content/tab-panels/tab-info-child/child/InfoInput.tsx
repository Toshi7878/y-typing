import { Input, FormLabel, useTheme } from "@chakra-ui/react";
import { useSetCanUploadAtom } from "@/app/edit/edit-atom/editAtom";
import { ThemeColors } from "@/types";
import { Dispatch } from "react";

interface InfoInputProps {
  isGeminiLoading?: boolean;
  label: string;
  placeholder: string;
  inputState: string;
  setInputState: Dispatch<string>;
  isRequired?: boolean;
}
const InfoInput = (props: InfoInputProps) => {
  const theme: ThemeColors = useTheme();
  const setCanUpload = useSetCanUploadAtom();
  return (
    <>
      <FormLabel mb="0" width="150px" fontWeight="bold" fontSize="sm">
        {props.label}
      </FormLabel>

      <Input
        isInvalid={props.isRequired && props.inputState === ""}
        placeholder={props.placeholder}
        size="sm"
        fontWeight={props.isRequired ? "bold" : "normal"}
        bg={theme.colors.background}
        borderColor={`${theme.colors.card.borderColor}60`}
        value={props.inputState}
        onChange={(e) => {
          setCanUpload(true);
          props.setInputState(e.target.value);
        }}
      />
    </>
  );
};

export default InfoInput;
