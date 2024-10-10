import { Box } from "@chakra-ui/react";
import React from "react";

interface UserRankProps {
  userRank: number;
}

const UserRank = ({ userRank }: UserRankProps) => {
  return (
    <Box fontSize="lg" fontWeight="bold" pl={5} pr={1} whiteSpace="nowrap" m={"auto"}>
      Rank: #{userRank}
    </Box>
  );
};

export default UserRank;
