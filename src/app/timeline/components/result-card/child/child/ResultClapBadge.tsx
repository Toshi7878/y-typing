"use client";
import { ThemeColors } from "@/types";
import { Badge, Flex, Text, useTheme } from "@chakra-ui/react";
import { FaHandsClapping } from "react-icons/fa6";

function ResultClapBadge() {
  const theme: ThemeColors = useTheme();

  const handleClapClick = () => {};
  return (
    <Badge
      mx={5}
      py={1}
      px={7}
      rounded={50}
      background={"transparent"}
      _hover={{
        bg: "#ffb6251c",
        color: "#ffb825",
      }}
      cursor="pointer"
      borderColor={theme.colors.card.borderColor}
      border={"1px"}
    >
      <Flex alignItems="center" letterSpacing={1}>
        <FaHandsClapping size="1rem" />
        <Text as="span" ml={1}>
          ×{0}
        </Text>
      </Flex>
    </Badge>
  );
}

export default ResultClapBadge;
