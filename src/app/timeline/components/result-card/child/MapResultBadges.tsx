import { ResultCardInfo } from "@/app/timeline/ts/type";
import { UserInputMode } from "@/components/UserInputMode";
import { Badge, Stack, VStack } from "@chakra-ui/react";
import React from "react";

interface ResultCardProps {
  result: ResultCardInfo;
}

const MapResultBadges = ({ result }: ResultCardProps) => {
  return (
    <VStack mr={4} align="end" spacing={4}>
      <Stack direction="row" spacing={4}>
        <Badge borderRadius="lg" px="2" ml="2" fontSize="lg">
          {result.score}
        </Badge>
        <Badge borderRadius="lg" px="2" fontSize="lg" maxW="fit-content">
          {result.clearRate.toFixed(1)}%
        </Badge>
      </Stack>
      <Badge borderRadius="lg" px="2" ml="2" fontSize="lg">
        <UserInputMode
          romaType={result.romaType}
          kanaType={result.kanaType}
          flickType={result.flickType}
        />
      </Badge>
    </VStack>
  );
};

export default MapResultBadges;
