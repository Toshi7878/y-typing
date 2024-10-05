import { ResultCardInfo } from "@/app/timeline/ts/type";
import { Badge, Stack, VStack } from "@chakra-ui/react";
import React from "react";

interface ResultCardProps {
  result: ResultCardInfo;
}

const MapResultBadges = ({ result }: ResultCardProps) => {
  return (
    <VStack mr={4} align="end">
      <Badge borderRadius="lg" px="2" fontSize="lg" maxW="fit-content">
        {result.clearRate.toFixed(1)}%
      </Badge>
      <Badge borderRadius="lg" px="2" ml="2" fontSize="lg">
        {result.score}
      </Badge>
    </VStack>
  );
};

export default MapResultBadges;
