import { ThemeColors } from "@/types";
import { Badge, Box, useTheme } from "@chakra-ui/react";
import React from "react";

interface UserRankProps {
  userRank: number;
}

const UserRank = ({ userRank }: UserRankProps) => {
  const theme: ThemeColors = useTheme();

  return (
    <Box fontSize="lg" fontWeight="bold" pl={5} pr={1} whiteSpace="nowrap" m={"auto"}>
      <Badge
        borderRadius="lg"
        px="2"
        ml="2"
        fontSize="lg"
        textTransform="none"
        border="solid 1px"
        bg={theme.colors.home.badge.info.bg}
        color={theme.colors.home.badge.info.color}
        borderColor={theme.colors.home.badge.info.borderColor}
      >
        Rank: #{userRank}
      </Badge>
    </Box>
  );
};

export default UserRank;
