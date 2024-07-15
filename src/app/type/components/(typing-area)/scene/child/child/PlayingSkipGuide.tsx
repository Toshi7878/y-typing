import { Box } from "@chakra-ui/react";
import React, { forwardRef, useImperativeHandle, useState } from "react";

export interface SkipGuideRef {
  getSkipGuide: () => string;
  setSkipGuide: (guide: string) => void;
  displaySkipGuide: (
    kana: string,
    lineTime: number,
    lineRemainTime: number,
    skipGuideRef: React.RefObject<SkipGuideRef>,
  ) => void;
}

interface PlayingSkipGuideProps {
  className?: string;
}

const PlayingSkipGuide = forwardRef<SkipGuideRef, PlayingSkipGuideProps>(
  ({ className = "" }: PlayingSkipGuideProps, ref) => {
    const [skip, setSkipGuide] = useState("");

    useImperativeHandle(ref, () => ({
      getSkipGuide: () => skip,
      setSkipGuide: (guide: string) => setSkipGuide(guide),
      displaySkipGuide: (
        kana: string,
        lineTime: number,
        lineRemainTime: number,
        skipGuideRef: React.RefObject<SkipGuideRef>,
      ) => {
        const SKIP_IN = 0.4; //ラインが切り替わり後、指定のtimeが経過したら表示
        const SKIP_OUT = 4; //ラインの残り時間が指定のtimeを切ったら非表示
        const SKIP_KEY = "Space";
        const IS_SKIP_DISPLAY = !kana && lineTime >= SKIP_IN && lineRemainTime >= SKIP_OUT;
        const skip = skipGuideRef.current?.getSkipGuide();

        //スキップ表示絶対条件 && 既に表示されているか
        if (IS_SKIP_DISPLAY) {
          if (!skip) {
            skipGuideRef.current!.setSkipGuide(SKIP_KEY);
          }
        } else if (skip) {
          skipGuideRef.current!.setSkipGuide("");
        }
      },
    }));

    return <Box className={className}>{skip ? `Type ${skip} key to Skip. ⏩` : ""}</Box>;
  },
);

PlayingSkipGuide.displayName = "PlayingSkipGuide"; // 追加

export default PlayingSkipGuide;
