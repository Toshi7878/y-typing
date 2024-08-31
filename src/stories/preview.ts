import { extendTheme } from "@chakra-ui/react";

const myTheme = extendTheme({
  // カスタムテーマの設定をここに追加
});

export const parameters = {
  chakra: {
    theme: myTheme,
  },
};
