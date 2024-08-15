import { Box, Text } from "@chakra-ui/react";
import React from "react";

interface EndTextProps {
  isPerfect: boolean;
  gameStateRef: React.RefObject<any>;
  session: any;
  status: any;
  bestScoreRef: React.RefObject<any>;
  speedData: any;
}

const EndText = ({
  isPerfect,
  gameStateRef,
  session,
  status,
  bestScoreRef,
  speedData,
}: EndTextProps) => {
  return (
    <Box textAlign="left" fontSize="3xl" mx={2} id="end_text">
      {isPerfect && <Text as="span">パーフェクト！！</Text>}
      <Text as="span">
        {gameStateRef.current!.practice.isPracticeMode ? (
          <>練習モード終了</>
        ) : gameStateRef.current!.replay.userName !== "" ? (
          <>リプレイ再生終了</>
        ) : !session ? (
          <>
            スコアは{status.score}
            です。ログインをするとランキングに登録することができます。
          </>
        ) : bestScoreRef.current === 0 ? (
          <>初めての記録です！スコアは{status.score}です。</>
        ) : status.score > bestScoreRef.current ? (
          <>
            おめでとうございます！最高スコアが{bestScoreRef.current}から{status.score}
            に更新されました！
          </>
        ) : (
          <>
            最高スコアは{bestScoreRef.current}です。記録更新まであと
            {bestScoreRef.current - status.score}です。
          </>
        )}
      </Text>
      {speedData.defaultSpeed < 1 && <Box>1.00倍速以上でランキング登録できます。</Box>}
    </Box>
  );
};

export default EndText;
