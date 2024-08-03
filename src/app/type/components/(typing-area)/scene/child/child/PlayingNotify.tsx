import { playingNotifyAtom } from "@/app/type/(atoms)/gameRenderAtoms";

import { Box } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { motion } from "framer-motion"; // 追加
import { FaPause } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa6";
import { useRefs } from "@/app/type/(contexts)/refsProvider";

interface PlayingNotifyProps {
  className?: string;
}

const PlayingNotify = ({ className = "" }: PlayingNotifyProps) => {
  const [notify] = useAtom(playingNotifyAtom);

  return (
    <motion.div
      key={Date.now()} // 追加: 毎回新しいkeyを生成
      initial={{ opacity: 1 }}
      animate={{ opacity: notify.description !== "ll" ? 0 : 1 }}
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
  );
};

export default PlayingNotify;
