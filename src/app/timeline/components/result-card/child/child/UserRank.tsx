import { Badge, Box } from "@chakra-ui/react";
import React from "react";

interface UserRankProps {
  userRank: number;
}

const UserRank = ({ userRank }: UserRankProps) => {
  return (
    <Box fontSize="lg" fontWeight="bold" pl={5} pr={1} whiteSpace="nowrap" m={"auto"}>
      <Badge borderRadius="lg" px="2" ml="2" fontSize="lg" textTransform="none">
        Rank: #{userRank}
      </Badge>
    </Box>
  );
};

export default UserRank;
