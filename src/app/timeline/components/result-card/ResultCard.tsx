"use client";
import { Card, CardFooter, CardHeader, Flex, useBreakpointValue, useTheme } from "@chakra-ui/react";
import { ResultCardInfo } from "../../ts/type";
import { ThemeColors } from "@/types";
import ResultUserName from "./child/child/ResultUserName";
import ResultInnerCardBody from "./child/ResultInnerCardBody";
import { MapResultBadgesMobile } from "./child/child/MapResultBadgesLayout";
import ResultClapButton from "./child/child/ResultClapButton";
import { useSession } from "next-auth/react";

interface ResultCardProps {
  result: ResultCardInfo;
}

function ResultCard(props: ResultCardProps) {
  const { result } = props;
  const { data: session } = useSession();

  const theme: ThemeColors = useTheme();
  const showBadges = useBreakpointValue({ base: false, md: true }, { ssr: false });

  return (
    <Card
      transition="box-shadow 0.3s"
      bg={theme.colors.background.card}
      _hover={{
        boxShadow: theme.colors.home.card.hover,
      }}
    >
      <CardHeader bg={theme.colors.background.card} borderRadius="md" mx={2} py={3}>
        <Flex alignItems="baseline" justifyContent="space-between">
          <ResultUserName result={result} />

          {session?.user.name ? (
            <ResultClapButton
              resultId={result.id}
              clapCount={result.clapCount}
              hasClap={result.hasClap}
            />
          ) : null}
        </Flex>
      </CardHeader>
      <ResultInnerCardBody result={result} />
      <CardFooter bg={theme.colors.background.card} borderRadius="md" pb={1}>
        {!showBadges && <MapResultBadgesMobile props={result} />}
      </CardFooter>
    </Card>
  );
}

export default ResultCard;
