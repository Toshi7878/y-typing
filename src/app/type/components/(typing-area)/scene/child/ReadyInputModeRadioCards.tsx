import { Box, HStack, useRadio, useRadioGroup } from "@chakra-ui/react";

// 1. Create a component that consumes the `useRadio` hook
function RadioCard(props) {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label" minW="33.33%">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        boxShadow="md"
        borderColor="black"
        className="font-bold select-none"
        _checked={{
          bg: "teal.600",

          color: "white",

          borderColor: "teal.600",
          _hover: {
            bg: "teal.600",
          },
        }}
        _focus={{
          boxShadow: "outline",
        }}
        _hover={{
          bg: "teal.300",
        }}
        px={15}
        py={12}
      >
        {props.children}
      </Box>
    </Box>
  );
}

// Step 2: Use the `useRadioGroup` hook to control a group of custom radios.
function ReadyInputModeRadioCards() {
  const options = ["ローマ字入力", "かな入力", "フリック入力"];

  const { getRootProps, getRadioProps } = useRadioGroup({
    defaultValue: "ローマ字入力",
    onChange: console.log,
  });

  const group = getRootProps();

  return (
    <HStack {...group} spacing={0} width={"100%"}>
      {options.map((value) => {
        const radio = getRadioProps({ value });
        return (
          <RadioCard key={value} {...radio} isDisabled={value === "フリック入力"}>
            {value}
          </RadioCard>
        );
      })}
    </HStack>
  );
}

export default ReadyInputModeRadioCards;
