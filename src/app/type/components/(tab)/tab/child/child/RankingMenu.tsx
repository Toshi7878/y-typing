import { sceneAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { Button, Stack } from "@chakra-ui/react"; // Boxコンポーネントを追加
import { useAtom } from "jotai";

const RankingMenu = ({ userId }: { userId: string }) => {
  const [scene] = useAtom(sceneAtom);
  return (
    <Stack
      className="rounded-md"
      position="absolute"
      zIndex="tooltip"
      bg="white"
      boxShadow="md"
      p={2}
    >
      <Button
        as="a"
        href={`/user/${userId}`}
        variant="unstyled"
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
        isDisabled={scene === "playing"}
      >
        リプレイ再生
      </Button>
    </Stack>
  );
};

export default RankingMenu;
