"use client";
import { Card, CardFooter, CardHeader, useBreakpointValue, useTheme } from "@chakra-ui/react";
import { ResultCardInfo } from "../../ts/type";
import { ThemeColors } from "@/types";
import ResultUserName from "./child/child/ResultUserName";
import ResultInnerCardBody from "./child/ResultInnerCardBody";
import { MapResultBadgesMobile } from "./child/child/MapResultBadgesLayout";

interface ResultCardProps {
  result: ResultCardInfo;
}

function ResultCard(props: ResultCardProps) {
  const { result } = props;
  const theme: ThemeColors = useTheme();
  const showBadges = useBreakpointValue({ base: false, md: true });

  return (
    <Card
      transition="box-shadow 0.3s"
      bg={theme.colors.card.bg}
      _hover={{
        boxShadow: theme.colors.home.card.hover,
      }}
    >
      <CardHeader bg={theme.colors.card.bg} borderRadius="md" mx={2} py={3}>
        <ResultUserName result={result} />
      </CardHeader>
      <ResultInnerCardBody result={result} />
      <CardFooter bg={theme.colors.card.bg} borderRadius="md" pb={1}>
        {!showBadges && <MapResultBadgesMobile props={result} />}
      </CardFooter>
    </Card>
  );
}

export default ResultCard;
