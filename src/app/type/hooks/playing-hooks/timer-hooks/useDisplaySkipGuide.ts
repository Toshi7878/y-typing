import { SkipGuideRef } from "@/app/type/components/typing-area/scene/playing-child/child/PlayingSkipGuide";
import { RefObject } from "react";

interface useDisplaySkipGuideProps {
  kana: string;
  lineConstantTime: number;
  lineRemainTime: number;
  skipGuideRef: RefObject<SkipGuideRef>;
  isRetrySkip: boolean;
}

export const useDisplaySkipGuide = () => {
  return ({
    kana,
    lineConstantTime,
    lineRemainTime,
    skipGuideRef,
    isRetrySkip,
  }: useDisplaySkipGuideProps) => {
    const SKIP_IN = 0.4; //ラインが切り替わり後、指定のtimeが経過したら表示
    const SKIP_OUT = 4; //ラインの残り時間が指定のtimeを切ったら非表示
    const SKIP_KEY = "Space";
    const IS_SKIP_DISPLAY =
      (!kana && lineConstantTime >= SKIP_IN && lineRemainTime >= SKIP_OUT) || isRetrySkip;
    const skip = skipGuideRef.current?.getSkipGuide();

    //スキップ表示絶対条件 && 既に表示されているか
    if (IS_SKIP_DISPLAY) {
      if (!skip) {
        skipGuideRef.current!.setSkipGuide(SKIP_KEY);
      }
    } else if (skip) {
      skipGuideRef.current!.setSkipGuide("");
    }
  };
};
