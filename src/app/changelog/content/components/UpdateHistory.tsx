import { Box, Text, UnorderedList, ListItem } from "@chakra-ui/react"; // UnorderedListとListItemを追加
import React from "react";

// ダミーデータを更新
const updates = [{ date: "2024-08-15", descriptions: ["更新履歴を追加"] }];

const UpdateHistory = () => {
  return (
    <Box>
      {updates.map((update, index) => (
        <Box key={index} mb={4}>
          <Text fontWeight="bold">{update.date}</Text>
          <UnorderedList>
            {update.descriptions.map((desc, i) => (
              <ListItem key={i}>{desc}</ListItem>
            ))}
          </UnorderedList>
        </Box>
      ))}
    </Box>
  );
};

export default UpdateHistory;
