import { GameStateRef, Speed, Status } from "@/app/type/(ts)/type";
import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import React from "react";

interface EndTextProps {
  isPerfect: boolean;
  gameStateRef: React.RefObject<GameStateRef>;
  session: Session | null;
  status: Status;
  bestScoreRef: React.RefObject<number>;
  speedData: Speed;
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
<<<<<<< HEAD
          <>初めての記録です！スコアは {status.score} です。</>
        ) : status.score > bestScoreRef.current ? (
=======
          <>初めての記録です！スコアは{status.score}です。</>
        ) : status.score > bestScoreRef.current! ? (
>>>>>>> 595212e9c2203d6108fe4a3e5d52a7ec326d8cc2
          <>
            おめでとうございます！最高スコアが {bestScoreRef.current} から {status.score}{" "}
            に更新されました！
          </>
        ) : (
          <>
<<<<<<< HEAD
            最高スコアは {bestScoreRef.current} です。記録更新まであと{" "}
            {bestScoreRef.current - status.score} です。
=======
            最高スコアは{bestScoreRef.current}です。記録更新まであと
            {bestScoreRef.current! - status.score}です。
>>>>>>> 595212e9c2203d6108fe4a3e5d52a7ec326d8cc2
          </>
        )}
      </Text>
      {speedData.defaultSpeed < 1 && <Box>1.00倍速以上でランキング登録できます。</Box>}
    </Box>
  );
};

export default EndText;
