import { Box, Text, UnorderedList, ListItem } from "@chakra-ui/react"; // UnorderedListとListItemを追加
import React from "react";

// ダミーデータを更新
const updates = [
  {
    date: "2024-08-21",
    descriptions: [
      `"ん" の入力に2打鍵を要するパターン(nn xn n')の時に配点が10Pointになっていた問題を修正。`,
      `ローマ字入力で "んう" の入力パターン(nwu nwhu)に対応`,
    ],
  },
  { date: "2024-08-20", descriptions: ["練習モードで選択中のライン表示を追加"] },
  { date: "2024-08-19", descriptions: [`ローマ字入力モードで "..." → "z." ".." → "z," に対応`] },
  {
    date: "2024-08-18",
    descriptions: [
      "ランキング登録ボタンクリック時にローディングアニメーションが行われないバグを修正",
      "倍速時に打鍵記録データが1倍速の打鍵時間で記録されていた不具合を修正。(修正前の倍速リプレイは正常に再生できなくなりますm(_ _)m)",
      "倍速プレイ時にタイムボーナスが低くなるバグを修正",
      "詳細リザルトの取得Point+timeBonus点にカーソルを合わせたときに合計Point表示・時点のスコア表示を追加",
    ],
  },
  {
    date: "2024-08-17",
    descriptions: [
      "リプレイモード終了時にステータスがリセットされるバグを修正",
      "リプレイモードのLine Kpm計算が正常に再生されていないバグを修正",
    ],
  },
  {
    date: "2024-08-16",
    descriptions: [
      "0Miss & 0Lost達成時はスコアに関係なくランキング登録ボタンを設置(スコアが低い場合は確認ダイアログ表示)",
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
