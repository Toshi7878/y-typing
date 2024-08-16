import { Box, Text, UnorderedList, ListItem } from "@chakra-ui/react"; // UnorderedListとListItemを追加
import React from "react";

// ダミーデータを更新
const updates = [
  {
    date: "2024-08-16",
    descriptions: [
      "0Miss & 0Lost達成時はスコアに関係なくランキング登録ボタンを設置(スコアが低い場合は確認ダイアログ表示)※登録中のローディングアニメーションが適用されてないバグがある。",
      "0Miss & 0Lostの記録は正確率と最大コンボ数の色が変わるように変更",
    ],
  },
  { date: "2024-08-15", descriptions: ["更新履歴ページを追加"] },
];

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