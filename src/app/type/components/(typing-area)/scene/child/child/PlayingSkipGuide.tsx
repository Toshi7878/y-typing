import { skipGuideAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { Box } from "@chakra-ui/react";
import { useAtom } from "jotai";
import React from "react";

export const skipGuide = (
  kana: string,
  lineTime: number,
  lineRemainTime: number,
  skip: string,
  setSkipGuide: (value: string) => void,
) => {
  const SKIP_IN = 0.4; //ラインが切り替わり後、指定のtimeが経過したら表示
  const SKIP_OUT = 4; //ラインの残り時間が指定のtimeを切ったら非表示
  const SKIP_KEY = "Space";

  const IS_SKIP_DISPLAY = !kana && lineTime >= SKIP_IN && lineRemainTime >= SKIP_OUT;

  //スキップ表示絶対条件 && 既に表示されているか
  if (IS_SKIP_DISPLAY) {
    if (!skip) {
      setSkipGuide(SKIP_KEY);
    }
  } else if (skip) {
    setSkipGuide("");
  }
};

const PlayingSkipGuide = () => {
  const [skip] = useAtom(skipGuideAtom);

  return (
    <Box fontWeight="bold" fontSize="sm">
      {skip ? `Type Space key to Skip. ⏩` : ""}
    </Box>
  );
};

export default PlayingSkipGuide;
