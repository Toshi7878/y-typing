import { playingNotifyAtom, sceneAtom } from "@/app/type/(atoms)/gameRenderAtoms";

import { Box } from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";
import { AnimatePresence, motion } from "framer-motion"; // 追加
import { FaPause } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa6";
import { useEffect } from "react";
import { useRefs } from "@/app/type/(contexts)/refsProvider";

interface PlayingNotifyProps {
  className?: string;
}

const NON_ANIMATED = ["ll", "Replay", "Practice"];

const PlayingNotify = ({ className = "" }: PlayingNotifyProps) => {
  const { gameStateRef } = useRefs();
  const [notify, setNotify] = useAtom(playingNotifyAtom);
  const scene = useAtomValue(sceneAtom);

  const playModeNotify = () => {
    if (scene === "playing") {
      setNotify(Symbol(""));
    } else if (scene === "replay") {
      setNotify(Symbol(`Replay`));
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
    <Box className={`${className} absolute left-1/2 transform -translate-x-[155px]`}>
      {notify.description && NON_ANIMATED.includes(notify.description) ? (
        <Box
          className={`${className} ${notify.description === "Replay" || notify.description === "Practice" ? "opacity-30" : ""}`}
        >
          {notify.description === "ll" ? (
            <FaPause />
          ) : notify.description === "Replay" ? (
            `${gameStateRef.current!.replay.userName} Replay`
          ) : (
            notify.description
          )}
        </Box>
      ) : (
        <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
          {notify.description && (
            <motion.div
              key={Date.now()}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0 }} // 追加: fadeoutアニメーション
            >
              <Box>{notify.description === "▶" ? <FaPlay /> : notify.description}</Box>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </Box>
  );
};

export default PlayingNotify;
