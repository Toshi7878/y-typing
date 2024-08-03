import { playingNotifyAtom, sceneAtom } from "@/app/type/(atoms)/gameRenderAtoms";

import { Box } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { AnimatePresence, motion } from "framer-motion"; // 追加
import { FaPause } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa6";
import { useEffect } from "react";

interface PlayingNotifyProps {
  className?: string;
}

const NON_ANIMATED = ["ll", "Replay", "Practice"];

const PlayingNotify = ({ className = "" }: PlayingNotifyProps) => {
  const [notify, setNotify] = useAtom(playingNotifyAtom);
  const [scene] = useAtom(sceneAtom);

  const playModeNotify = () => {
    if (scene === "playing") {
      setNotify(Symbol(""));
    } else if (scene === "replay") {
      setNotify(Symbol("Replay"));
    } else if (scene === "practice") {
      setNotify(Symbol("Practice"));
    }
  };
  const handleExitComplete = () => {
    // exitアニメーション完了時の処理をここに記述

    if (!NON_ANIMATED.includes(notify.description!)) {
      playModeNotify();
    }
  };

  useEffect(() => {
    playModeNotify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);
  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {notify.description && (
        <motion.div
          key={Date.now()} // 追加: 毎回新しいkeyを生成
          initial={{ opacity: 1 }}
          animate={{ opacity: NON_ANIMATED.includes(notify.description) ? 1 : 0 }}
          transition={{ duration: 1 }}
          exit={{ opacity: 0 }} // 追加: fadeoutアニメーション
          className="absolute left-1/2 transform -translate-x-[140px]"
        >
          {notify.description === "▶" ? (
            <FaPlay className={`${className}`} />
          ) : notify.description === "ll" ? (
            <FaPause className={`${className}`} />
          ) : (
            <Box className={`${className}`}>{notify.description}</Box>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlayingNotify;
