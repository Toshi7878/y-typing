import { Box } from "@chakra-ui/react";
import React from "react";
import ResultBadge from "./child/ResultBadge";

interface UserRankProps {
  userRank: number;
}

const UserRank = ({ userRank }: UserRankProps) => {
  return (
    <Box fontSize="lg" fontWeight="bold" pl={5} pr={1} whiteSpace="nowrap" m={"auto"}>
      <ResultBadge>Rank: #{userRank}</ResultBadge>
    </Box>
  );
};

export default UserRank;
