import { ResultCardInfo } from "@/app/timeline/ts/type";
import ClearRateText from "@/components/user-result-text/ClearRateText";
import { UserInputModeText } from "@/components/user-result-text/UserInputModeText";
import { Badge, Stack, Text, VStack } from "@chakra-ui/react";
import React from "react";

interface ResultCardProps {
  props: ResultCardInfo;
}

const MapResultBadges = ({ props }: ResultCardProps) => {
  const isPerfect = props.miss === 0 && props.lost === 0;

  return (
    <VStack align="end" mr={5}>
      <Stack direction="row" spacing={5} mb={2}>
        <Badge borderRadius="lg" px="2" ml="2" fontSize="lg">
          <UserInputModeText
            romaType={props.romaType}
            kanaType={props.kanaType}
            flickType={props.flickType}
          />
        </Badge>
        <Badge
          borderRadius="lg"
          px="2"
          ml="2"
          fontSize="lg"
          letterSpacing={1}
          minW="95px"
          textAlign="center"
        >
          {props.score}
        </Badge>
        <Badge
          borderRadius="lg"
          px="2"
          fontSize="lg"
          minW="95px"
          letterSpacing={1}
          textAlign="center"
        >
          <ClearRateText clearRate={props.clearRate} isPerfect={isPerfect} />
        </Badge>
      </Stack>
      <Stack direction="row" spacing={5}>
        <Badge borderRadius="lg" px="2" ml="2" fontSize="lg" textTransform="none" minW="95px">
          {props.kpm}
          <Text as="span" ml={1} letterSpacing={2}>
            kpm
          </Text>
        </Badge>
        <Badge borderRadius="lg" px="2" fontSize="lg" minW="95px">
          {props.defaultSpeed.toFixed(2)}
          <Text as="span" ml={1} letterSpacing={2}>
            倍速
          </Text>
        </Badge>
      </Stack>
    </VStack>
  );
};

export default MapResultBadges;
