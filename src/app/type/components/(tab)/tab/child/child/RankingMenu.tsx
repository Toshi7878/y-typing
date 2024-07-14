"use client";

import { Button, Stack } from "@chakra-ui/react"; // Boxコンポーネントを追加

const RankingMenu = ({ userId }: { userId: string }) => {
  return (
    <Stack
      className="rounded-md"
      position="absolute"
      zIndex="tooltip"
      bg="white"
      boxShadow="md"
      p={2} // パディングを追加
    >
      <Button
        as="a" // Linkとして機能させる
        href={`/user/${userId}`} // ユーザーページへのリンク
        variant="unstyled" // ボタンのスタイルを変更
        size="sm"
        _hover={{ backgroundColor: "gray.200" }} // ホバー時の背景色を追加
      >
        ユーザーページへ
      </Button>
      <Button
        variant="unstyled" // ボタンのスタイルを変更
        size="sm"
        _hover={{ backgroundColor: "gray.200" }} // ホバー時の背景色を追加
        onClick={() => {
          /* リプレイ再生ロジック */
        }}
      >
        リプレイ再生
      </Button>
    </Stack>
  );
};

export default RankingMenu;
