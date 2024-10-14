import { ResultCardInfo } from "@/app/timeline/ts/type";
import ClearRateText from "@/components/user-result-text/ClearRateText";
import { UserInputModeText } from "@/components/user-result-text/UserInputModeText";
import { Stack, Text, VStack } from "@chakra-ui/react";
import React from "react";
import ResultBadge from "./child/ResultBadge";

interface ResultCardProps {
  props: ResultCardInfo;
}

export const MapResultBadges = ({ props }: ResultCardProps) => {
  const isPerfect = props.miss === 0 && props.lost === 0;

  return (
    <VStack align="end" mr={5} spacing={5}>
      <Stack direction="row" mb={2}>
        <ResultBadge letterSpacing={1}>
          <UserInputModeText
            romaType={props.romaType}
            kanaType={props.kanaType}
            flickType={props.flickType}
          />
        </ResultBadge>
        <ResultBadge letterSpacing={1.5}>{props.score}</ResultBadge>
        <ResultBadge letterSpacing={1}>
          <ClearRateText clearRate={props.clearRate} isPerfect={isPerfect} />
        </ResultBadge>
      </Stack>
      <Stack direction="row">
        <ResultBadge letterSpacing={1}>
          {props.kpm}
          <Text as="span" ml={1} letterSpacing={2}>
            kpm
          </Text>
        </ResultBadge>
        <ResultBadge>
          {props.defaultSpeed.toFixed(2)}
          <Text as="span" ml={1} letterSpacing={2}>
            倍速
          </Text>
        </ResultBadge>
      </Stack>
    </VStack>
  );
};

export const MapResultBadgesMobile = ({ props }: ResultCardProps) => {
  const isPerfect = props.miss === 0 && props.lost === 0;

  return (
    <>
      <VStack align="end" mr={5} spacing={5}>
        <ResultBadge letterSpacing={1}>Rank: #{props.rank}</ResultBadge>
        <ResultBadge letterSpacing={1}>
          <UserInputModeText
            romaType={props.romaType}
            kanaType={props.kanaType}
            flickType={props.flickType}
          />
        </ResultBadge>
      </VStack>
      <VStack align="end" mr={5} spacing={5}>
        <ResultBadge letterSpacing={1.5}>{props.score}</ResultBadge>
        <ResultBadge letterSpacing={1}>
          {props.kpm}
          <Text as="span" ml={1} letterSpacing={2}>
            kpm
          </Text>
        </ResultBadge>
      </VStack>
      <VStack align="end" mr={5} spacing={5}>
        <ResultBadge letterSpacing={1}>
          <ClearRateText clearRate={props.clearRate} isPerfect={isPerfect} />
        </ResultBadge>
        <ResultBadge>
          {props.defaultSpeed.toFixed(2)}
          <Text as="span" ml={1} letterSpacing={2}>
            倍速
          </Text>
        </ResultBadge>
      </VStack>
    </>
  );
};
