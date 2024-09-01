"use client";
import { Button, FormLabel, HStack, RadioGroup, Stack, useTheme } from "@chakra-ui/react";
import { useState } from "react";
import { ThemeColors } from "@/types";

interface ConvertOptionButtonsProps {
  sendIndexedDB: (target: HTMLInputElement) => void;
}

export default function ConvertOptionButtons(props: ConvertOptionButtonsProps) {
  const theme: ThemeColors = useTheme();

  const [selectedConvertOption, setSelectedConvertOption] = useState("");

  const options = [
    { colorScheme: "green", label: "記号なし(一部除く)", value: "non_symbol" },
    { colorScheme: "yellow", label: "記号あり(一部)", value: "add_symbol" },
    { colorScheme: "red", label: "記号あり(すべて)", value: "add_symbol_all" },
  ];

  return (
    <HStack alignItems="baseline">
      <FormLabel fontSize="sm">読み変換</FormLabel>

      <RadioGroup onChange={setSelectedConvertOption} value={selectedConvertOption}>
        <Stack direction="row">
          {options.map((option) => (
            <Button
              key={option.label}
              variant={selectedConvertOption === option.value ? "solid" : "outline"}
              size="sm"
              width="150px"
              height="50px"
              name="word-convert-option"
              bg={selectedConvertOption === option.value ? undefined : theme.colors.background}
              colorScheme={option.colorScheme}
              value={option.value}
              onClick={(e) => {
                setSelectedConvertOption(option.value);
                props.sendIndexedDB(e.target as HTMLInputElement);
              }}
            >
              {option.label}
            </Button>
          ))}
        </Stack>
      </RadioGroup>
    </HStack>
  );
}
