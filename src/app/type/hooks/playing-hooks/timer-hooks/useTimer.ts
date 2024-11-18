import { SkipGuideRef } from "../../../components/typing-area/scene/playing-child/child/PlayingSkipGuide";
import { PlayingTotalTimeRef } from "../../../components/typing-area/scene/playing-child/child/PlayingTotalTime";
import { CalcTypeSpeed } from "../../../ts/scene-ts/playing/calcTypeSpeed";
import { CreateMap } from "../../../ts/scene-ts/ready/createTypingWord";
import { LineResult } from "../../../ts/scene-ts/playing/lineResult";
import { InputModeType } from "../../../ts/type";
import {
  updateReplayStatus,
  useLineReplayUpdate,
  useReplay,
} from "../../../ts/scene-ts/playing/replay";
import { typeTicker } from "../../useYoutubeEvents";
import { DEFAULT_STATUS_REF } from "../../../ts/const/typeDefaultValue";
import {
  useInputModeAtom,
  useLineResultsAtom,
  useMapAtom,
  useRankingScoresAtom,
  useSceneAtom,
  useSetLineResultsAtom,
  useTypePageSpeedAtom,
  useUserOptionsAtom,
} from "@/app/type/type-atoms/gameRenderAtoms";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import { useDisplaySkipGuide } from "@/app/type/hooks/playing-hooks/timer-hooks/useDisplaySkipGuide";
import { useGetSeekLineCount } from "./useSeekGetLineCount";

export const usePlayTimer = () => {
  const {
    statusRef,
    playingCenterRef,
    tabStatusRef,
    gameStateRef,
    lineProgressRef,
    playingLineTimeRef,
    ytStateRef,
    playerRef,
  } = useRefs();
  const map = useMapAtom() as CreateMap;

  const scene = useSceneAtom();
  const speedData = useTypePageSpeedAtom();
  const displaySkipGuide = useDisplaySkipGuide();
  const updateLine = useUpdateLine();
  const calcLineResult = useCalcLineResult();
  const replay = useReplay();
  const getSeekLineCount = useGetSeekLineCount();
  const userOptionsAtom = useUserOptionsAtom();

  return (
    totalTimeProgressRef: React.RefObject<HTMLProgressElement>,
    playingTotalTimeRef: React.RefObject<PlayingTotalTimeRef>,
    skipGuideRef: React.RefObject<SkipGuideRef>,
  ) => {
    const ytCurrentTime = playerRef.current.getCurrentTime() - userOptionsAtom.timeOffset;
    ytStateRef.current!.currentTime = ytCurrentTime;

    const ytConstantTime = ytCurrentTime / speedData.playSpeed;

    const count = statusRef.current!.status.count;
    const currentLine = map.mapData[count - 1];
    const nextLine = map.mapData[count];
    const movieDuration = ytStateRef.current!.movieDuration;
    const nextLineTime = nextLine.time > movieDuration ? movieDuration : nextLine.time;

    const lineRemainTime = (nextLineTime - ytCurrentTime) / speedData.playSpeed;
    const currentTotalTimeProgress = totalTimeProgressRef.current;
    const currentLineProgress = lineProgressRef.current;
    const lineTime = currentLine && count ? ytCurrentTime - currentLine.time : ytCurrentTime;
    const lineConstantTime = Math.round((lineTime / speedData.playSpeed) * 1000) / 1000;
    currentLineProgress!.value = ytCurrentTime < 0 ? nextLine.time + ytCurrentTime : lineTime;

    if (
      currentTotalTimeProgress &&
      Math.abs(ytCurrentTime - currentTotalTimeProgress.value) >= map.currentTimeBarFrequency
    ) {
      currentTotalTimeProgress.value = ytCurrentTime;
    }

    if (scene === "replay") {
      if (count && lineTime) {
        replay({ lineConstantTime });
      }
    }

    const displayRemainTime = playingLineTimeRef.current!.getRemainTime();
    if (Math.abs(nextLineTime / speedData.playSpeed - ytConstantTime - displayRemainTime) >= 0.1) {
      const currentPlayingCenterRef = playingCenterRef.current;

      if (!currentPlayingCenterRef) {
        return;
      }

      const lineWord = currentPlayingCenterRef!.getLineWord();
      const status = tabStatusRef.current!.getStatus();

      playingLineTimeRef.current?.setRemainTime(lineRemainTime);

      if (lineWord.nextChar["k"]) {
        const typeSpeed = new CalcTypeSpeed("timer", status!, lineConstantTime, statusRef);
        playingLineTimeRef.current?.setLineKpm(typeSpeed.lineKpm);
      }

      const isRetrySkip = gameStateRef.current!.isRetrySkip;

      if (
        isRetrySkip &&
        map.mapData[map.startLine].time - 3 * speedData.playSpeed <= ytCurrentTime
      ) {
        gameStateRef.current!.isRetrySkip = false;
      }

      displaySkipGuide({
        kana: lineWord.nextChar["k"],
        lineConstantTime,
        lineRemainTime,
        skipGuideRef,
        isRetrySkip,
      });

      const currentTotalTime = playingTotalTimeRef.current!.getCurrentTime();

      if (Math.abs(ytConstantTime - currentTotalTime) >= 1) {
        playingTotalTimeRef.current?.setCurrentTime(ytConstantTime);
      }
    }

    if (ytCurrentTime >= nextLineTime || ytCurrentTime >= ytStateRef.current!.movieDuration) {
      calcLineResult({ count, lineConstantTime });

      if (currentLine?.["lyrics"] === "end" || ytCurrentTime >= ytStateRef.current!.movieDuration) {
        playerRef.current.stopVideo();
        typeTicker.stop();

        return;
      } else if (nextLine) {
        if (scene === "playing") {
          statusRef.current!.status.count += 1;
        } else {
          statusRef.current!.status.count = getSeekLineCount(ytCurrentTime);
        }

        updateLine(statusRef.current!.status.count);
      }
    }
  };
};

export const useCalcLineResult = () => {
  const { statusRef, playingCenterRef, tabStatusRef, playingComboRef, gameStateRef } = useRefs();
  const scene = useSceneAtom();
  const map = useMapAtom() as CreateMap;
  const lineResults = useLineResultsAtom();
  const inputMode = useInputModeAtom();
  const speedData = useTypePageSpeedAtom();
  const rankingScores = useRankingScoresAtom();
  const setLineResults = useSetLineResultsAtom();

  return ({ count, lineConstantTime }: { count: number; lineConstantTime: number }) => {
    const currentPlayingCenterRef = playingCenterRef.current;
    const status = tabStatusRef.current!.getStatus();

    if (scene === "playing" || scene === "practice") {
      const lineWord = currentPlayingCenterRef!.getLineWord();
      const typeSpeed = new CalcTypeSpeed(
        "timer",
        status!,
        lineWord.nextChar["k"] ? lineConstantTime : statusRef.current!.lineStatus.lineClearTime,
        statusRef,
      );

      const lineResult = new LineResult(
        status!,
        statusRef,
        lineWord,
        inputMode as InputModeType,
        map,
        typeSpeed.totalKpm,
        rankingScores,
        scene,
      );

      if (count > 0) {
        statusRef.current!.status.totalTypeTime += lineWord.nextChar["k"]
          ? lineConstantTime
          : statusRef.current!.lineStatus.lineClearTime;
        statusRef.current!.status.totalLatency += statusRef.current!.lineStatus.latency;

        const tTime = Math.round(statusRef.current!.status.totalTypeTime * 1000) / 1000;
        const mode = statusRef.current!.lineStatus.lineStartInputMode;
        const sp = statusRef.current!.lineStatus.lineStartSpeed;
        const typeResult = statusRef.current!.lineStatus.typeResult;
        const combo = playingComboRef.current!.getCombo();
        const lMiss = statusRef.current!.lineStatus.lineMiss;

        const lineScore = status!.point + status!.timeBonus + lMiss * 5;

        const lResult = lineResults[count - 1];
        const oldLineScore =
          lResult.status!.p! + lResult.status!.tBonus! + lResult.status!.lMiss! * 5;

        const isUpdateResult =
          (speedData.playSpeed >= 1 && lineScore >= oldLineScore) || scene === "playing";

        if (isUpdateResult) {
          const newLineResults = [...lineResults];
          if (map.mapData[count - 1].kpm.r > 0) {
            newLineResults[count - 1] = {
              status: {
                p: status!.point,
                tBonus: status!.timeBonus,
                lType: statusRef.current!.lineStatus.lineType,
                lMiss,
                lRkpm: typeSpeed.lineRkpm,
                lKpm: typeSpeed.lineKpm,
                lostW: lineResult.lostW,
                lLost: lineResult.lostLen,
                combo,
                tTime,
                mode,
                sp,
              },
              typeResult,
            };
          } else {
            //間奏ライン
            newLineResults[count - 1] = {
              status: {
                combo,
                tTime,
                mode,
                sp,
              },
              typeResult,
            };
          }

          setLineResults(newLineResults);
        }
      }

      if (scene === "playing") {
        tabStatusRef.current!.setStatus(lineResult.newStatus);
      } else if (scene === "practice") {
        const newStatus = updateReplayStatus(
          map!.mapData.length - 1,
          lineResults,
          map,
          rankingScores,
        );
        tabStatusRef.current!.setStatus(newStatus);
      }
    } else if (scene === "replay") {
      const newStatus = updateReplayStatus(count, lineResults, map, rankingScores);
      tabStatusRef.current!.setStatus(newStatus);
      if (count > 0) {
        const lineResult = lineResults[count - 1];
        playingComboRef.current?.setCombo(lineResult.status!.combo as number);
        statusRef.current!.status.totalTypeTime = lineResult.status!.tTime;
      }
    }
  };
};

export const useUpdateLine = () => {
  const { statusRef, playingLineTimeRef, playingCenterRef, lineProgressRef, ytStateRef } =
    useRefs();

  const userOptionsAtom = useUserOptionsAtom();
  const scene = useSceneAtom();
  const map = useMapAtom() as CreateMap;
  const inputMode = useInputModeAtom();
  const speedData = useTypePageSpeedAtom();
  const lineReplayUpdate = useLineReplayUpdate();

  return (newCount: number) => {
    const currentCount = newCount ? newCount - 1 : 0;
    statusRef.current!.lineStatus = structuredClone({
      ...DEFAULT_STATUS_REF.lineStatus,
      lineStartSpeed: speedData.playSpeed,
      lineStartInputMode: inputMode,
    });
    playingLineTimeRef.current?.setLineKpm(0);
    statusRef.current!.lineStatus.latency = 0;
    playingCenterRef.current!.setLineWord({
      correct: { k: "", r: "" },
      nextChar: [...structuredClone(map.mapData[currentCount].word)][0],
      word: [...structuredClone(map.mapData[currentCount].word)].slice(1),
      lineCount: currentCount,
    });

    playingCenterRef.current!.setLyrics(map.mapData[currentCount]["lyrics"]);

    const nextKpm =
      (inputMode === "roma" ? map.mapData[newCount].kpm["r"] : map.mapData[newCount].kpm["k"]) *
      speedData.playSpeed;
    if (nextKpm) {
      playingCenterRef.current!.setNextLyrics({
        lyrics:
          userOptionsAtom.nextDisplay === "word"
            ? map.mapData[newCount].kanaWord
            : map.mapData[newCount]["lyrics"],
        kpm: nextKpm.toFixed(0),
      });
    } else {
      playingCenterRef.current!.setNextLyrics({
        lyrics: "",
        kpm: "",
      });
    }

    if (lineProgressRef.current) {
      const progressElement = lineProgressRef.current as HTMLProgressElement;
      const nextTime = Number(map.mapData[newCount]["time"]);
      const movieDuration = ytStateRef.current!.movieDuration;

      progressElement.max =
        (nextTime > movieDuration ? movieDuration : nextTime) -
        Number(map.mapData[currentCount]["time"]);
    }

    if (scene === "replay") {
      lineReplayUpdate(currentCount);
    }
  };
};
