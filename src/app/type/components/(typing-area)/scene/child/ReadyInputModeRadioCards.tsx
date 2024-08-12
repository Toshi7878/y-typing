import { inputModeAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { InputModeType } from "@/app/type/(ts)/type";
import { Box, HStack, useRadio, useRadioGroup, UseRadioProps, useTheme } from "@chakra-ui/react";
import { useSetAtom } from "jotai";

interface RadioCardProps extends UseRadioProps {
  option: InputModeType;
  children: React.ReactNode;
}
function RadioCard({ option, children, ...props }: RadioCardProps) {
  const { getInputProps, getRadioProps } = useRadio(props);
  const theme = useTheme();

  const input = getInputProps();
  const checkbox = getRadioProps();
  const romaBg = theme.colors.type.ready.radio.roma.bg;
  const kanaBg = theme.colors.type.ready.radio.kana.bg;
  const flickBg = theme.colors.type.ready.radio.flick.bg;
  const selectedBg = option === "roma" ? romaBg : option === "kana" ? kanaBg : flickBg;
  return (
    <Box as="label" minW="33.33%">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        boxShadow="md"
        borderColor="type.card.borderColor"
        className="font-bold select-none"
        _hover={{
          bg: `${selectedBg}80`,
          color: "type.ready.radio.hover.color",
        }}
        _checked={{
          bg: selectedBg,
          color: "type.ready.radio.selected.color",
          borderColor: "type.card.borderColor",
          _hover: {
            bg: selectedBg,
          },
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={15}
        py={12}
      >
        {children}
      </Box>
    </Box>
  );
}

// Step 2: Use the `useRadioGroup` hook to control a group of custom radios.
function ReadyInputModeRadioCards() {
  const options: { value: InputModeType; label: string }[] = [
    { value: "roma", label: "ローマ字入力" },
    { value: "kana", label: "かな入力" },
    { value: "flick", label: "フリック入力" },
  ];

  const setInputMode = useSetAtom(inputModeAtom);

  const inputModeStorage = localStorage.getItem("inputMode");

  const defaultInputMode =
    inputModeStorage && ["roma", "kana", "flick"].includes(inputModeStorage)
      ? (inputModeStorage as InputModeType)
      : "roma";

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "inputMode",
    defaultValue: defaultInputMode,
    onChange: (value) => {
      console.log(value);
      setInputMode(value as InputModeType);
      localStorage.setItem("inputMode", value);
    },
  });

  const group = getRootProps();

  return (
    <HStack {...group} spacing={0} width={"100%"}>
      {options.map((option) => {
        const radio = getRadioProps({ value: option.value });
        return (
          <RadioCard
            key={option.value}
            option={option.value}
            {...radio}
            isDisabled={option.value === "flick"}
          >
            {option.label}
          </RadioCard>
        );
      })}
    </HStack>
  );
}

export default ReadyInputModeRadioCards;
