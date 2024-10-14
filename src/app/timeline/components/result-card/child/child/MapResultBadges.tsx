import { ResultCardInfo } from "@/app/timeline/ts/type";
import ClearRateText from "@/components/user-result-text/ClearRateText";
import { UserInputModeText } from "@/components/user-result-text/UserInputModeText";
import { ThemeColors } from "@/types";
import { Badge, Stack, Text, useTheme, VStack } from "@chakra-ui/react";
import React from "react";

interface ResultCardProps {
  props: ResultCardInfo;
}

const MapResultBadges = ({ props }: ResultCardProps) => {
  const isPerfect = props.miss === 0 && props.lost === 0;
  const theme: ThemeColors = useTheme();

  return (
    <VStack align="end" mr={5}>
      <Stack direction="row" spacing={5} mb={2}>
        <Badge
          borderRadius="lg"
          px="2"
          ml="2"
          fontSize="lg"
          textAlign="center"
          border="solid 1px"
          bg={theme.colors.home.badge.info.bg}
          color={theme.colors.home.badge.info.color}
          borderColor={theme.colors.home.badge.info.borderColor}
        >
          <UserInputModeText
            romaType={props.romaType}
            kanaType={props.kanaType}
            flickType={props.flickType}
          />
        </Badge>
        <Badge
          border="solid 1px"
          borderRadius="lg"
          px="2"
          ml="2"
          fontSize="lg"
          letterSpacing={1}
          minW="97.55px"
          textAlign="center"
          bg={theme.colors.home.badge.info.bg}
          color={theme.colors.home.badge.info.color}
          borderColor={theme.colors.home.badge.info.borderColor}
        >
          {props.score}
        </Badge>
        <Badge
          border="solid 1px"
          borderRadius="lg"
          px="2"
          fontSize="lg"
          minW="97.55px"
          letterSpacing={1}
          textAlign="center"
          bg={theme.colors.home.badge.info.bg}
          color={theme.colors.home.badge.info.color}
          borderColor={theme.colors.home.badge.info.borderColor}
        >
          <ClearRateText clearRate={props.clearRate} isPerfect={isPerfect} />
        </Badge>
      </Stack>
      <Stack direction="row" spacing={5}>
        <Badge
          border="solid 1px"
          borderRadius="lg"
          px="2"
          ml="2"
          fontSize="lg"
          textTransform="none"
          textAlign="center"
          minW="97.55px"
          bg={theme.colors.home.badge.info.bg}
          color={theme.colors.home.badge.info.color}
          borderColor={theme.colors.home.badge.info.borderColor}
        >
          {props.kpm}
          <Text as="span" ml={1} letterSpacing={2}>
            kpm
          </Text>
        </Badge>
        <Badge
          borderRadius="lg"
          px="2"
          fontSize="lg"
          minW="97.55px"
          textAlign="center"
          border="solid 1px"
          bg={theme.colors.home.badge.info.bg}
          color={theme.colors.home.badge.info.color}
          borderColor={theme.colors.home.badge.info.borderColor}
        >
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
