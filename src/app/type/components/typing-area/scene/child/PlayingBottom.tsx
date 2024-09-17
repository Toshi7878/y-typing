import { Box, HStack } from "@chakra-ui/react";
import PlayingLineProgress from "../playing-child/child/PlayingLineProgress";
import PlayingSkipGuide, { SkipGuideRef } from "../playing-child/child/PlayingSkipGuide";
import PlayingTotalTime, { PlayingTotalTimeRef } from "../playing-child/child/PlayingTotalTime";
import { useSceneAtom, useTypePageSpeedAtom } from "@/app/type/type-atoms/gameRenderAtoms";
import { useAtomValue } from "jotai";
import PlayingBottomBadge from "../playing-child/child/PlayingBottomBadge";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import PlayingLineSeekBadge from "../playing-child/child/PlayingLineSeekBadge";

interface PlayingBottomRef {
  skipGuideRef: React.RefObject<SkipGuideRef>;
  totalTimeProgressRef: React.RefObject<HTMLProgressElement>;
  playingTotalTimeRef: React.RefObject<PlayingTotalTimeRef>;
}

const PlayingBottom = function ({
  skipGuideRef,
  totalTimeProgressRef,
  playingTotalTimeRef,
}: PlayingBottomRef) {
  const { playingRef } = useRefs();
  const scene = useSceneAtom();
  const speedData = useTypePageSpeedAtom();

  const isPlayed = scene === "playing" || scene === "replay" || scene === "practice";

  return (
    <Box mx="8">
      <HStack
        justify="space-between"
        className={`mx-2 font-bold ${isPlayed ? "" : "invisible"} bottom-card-text`}
      >
        <PlayingSkipGuide ref={skipGuideRef} className="opacity-70" />
        <PlayingTotalTime className="text-2xl font-mono" ref={playingTotalTimeRef} />
      </HStack>
      <PlayingLineProgress ref={totalTimeProgressRef} id="total_progress" />
      <HStack
        justify="space-between"
        className={`mx-3 mt-2 mb-4 font-bold ${isPlayed ? "" : "invisible"}`}
      >
        {scene === "practice" ? (
          <PlayingLineSeekBadge
            badgeText={speedData.playSpeed.toFixed(2) + "倍速"}
            kbdTextPrev="F9-"
            kbdTextNext="+F10"
            onClick={() => {}}
            onClickPrev={() => playingRef.current!.practiceSpeedDown()}
            onClickNext={() => playingRef.current!.practiceSpeedUp()}
          />
        ) : (
          <PlayingBottomBadge
            badgeText={speedData.playSpeed.toFixed(2) + "倍速"}
            kbdText="F10"
            onClick={() => playingRef.current?.realtimeSpeedChange()}
            isPauseDisabled={true}
            isKbdHidden={scene === "replay" ? true : false}
          />
        )}
        {scene !== "playing" && (
          <>
            <PlayingLineSeekBadge
              badgeText="ライン移動"
              kbdTextPrev="←"
              kbdTextNext="→"
              onClick={() => {}}
              onClickPrev={() => playingRef.current!.prevLine()}
              onClickNext={() => playingRef.current!.nextLine()}
            />
            <PlayingBottomBadge
              badgeText="ライン一覧"
              kbdText="Tab"
              onClick={() => playingRef.current?.openLineList()}
              isPauseDisabled={false}
              isKbdHidden={false}
            />
          </>
        )}

        <PlayingBottomBadge
          badgeText="やり直し"
          kbdText="F4"
          onClick={() => playingRef.current?.retry()}
          isPauseDisabled={true}
          isKbdHidden={false}
        />
      </HStack>
    </Box>
  );
};

PlayingBottom.displayName = "PlayingBottom";

export default PlayingBottom;
