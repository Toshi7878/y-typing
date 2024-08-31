import { TabStatusRef } from "../../../components/type-tab-content/tab-status/TabStatus";
import { PlayingComboRef } from "../../../components/typing-area/scene/playing-child/child/PlayingCombo";
import { PlayingLineTimeRef } from "../../../components/typing-area/scene/playing-child/child/PlayingLineTime";
import { SkipGuideRef } from "../../../components/typing-area/scene/playing-child/child/PlayingSkipGuide";
import { PlayingTotalTimeRef } from "../../../components/typing-area/scene/playing-child/child/PlayingTotalTime";
import { PlayingCenterRef } from "../../../components/typing-area/scene/playing-child/PlayingCenter";
import { CalcTypeSpeed } from "./calcTypeSpeed";
import { defaultStatusRef } from "@/app/type/type-contexts/refsProvider";

import { CreateMap } from "../ready/createTypingWord";
import { LineResult } from "./lineResult";
import {
  GameStateRef,
  InputModeType,
  LineData,
  LineResultData,
  PlayingRef,
  SceneType,
  Speed,
  StatusRef,
  YTStateRef,
} from "../../type";
import { lineReplayUpdate, replay, updateReplayStatus } from "./replay";
import { getLineCount, typeTicker } from "../../youtubeEvents";

export const updateTimer = (
  map: CreateMap,
  lineResults: LineResultData[],
  setLineResults: React.Dispatch<React.SetStateAction<LineResultData[]>>,
  playerRef: React.RefObject<any>,
  ytStateRef: React.RefObject<YTStateRef>,
  speedData: Speed,
  totalTimeProgressRef: React.RefObject<HTMLProgressElement>,
  playingTotalTimeRef: React.RefObject<PlayingTotalTimeRef>,
  playingLineTimeRef: React.RefObject<PlayingLineTimeRef>,
  playingCenterRef: React.RefObject<PlayingCenterRef>,
  lineProgressRef: React.RefObject<HTMLProgressElement>,
  skipGuideRef: React.RefObject<SkipGuideRef>,
  statusRef: React.RefObject<StatusRef>,
  tabStatusRef: React.RefObject<TabStatusRef>,
  gameStateRef: React.RefObject<GameStateRef>,
  rankingScores: number[],
  playingComboRef: React.RefObject<PlayingComboRef>,
  inputMode: string,
  playingRef: React.RefObject<PlayingRef>,
  scene: SceneType,
) => {
  const ytCurrentTime = playerRef.current.getCurrentTime();
  ytStateRef.current!.currentTime = ytCurrentTime;

  const ytConstantTime = ytCurrentTime / speedData.playSpeed;

  const count = statusRef.current!.status.count;
  const prevLine = map.mapData[count - 1];
  const currentLine = map.mapData[count];
  const nextLine = map.mapData[count + 1];
  const remainTime = (Number(currentLine.time) - Number(ytCurrentTime)) / speedData.playSpeed;
  const currentTotalTimeProgress = totalTimeProgressRef.current;
  const currentLineProgress = lineProgressRef.current;
  const lineTime = prevLine && count ? ytCurrentTime - Number(prevLine["time"]) : ytCurrentTime;
  const lineConstantTime = Math.round((lineTime / speedData.playSpeed) * 1000) / 1000;
  currentLineProgress!.value = lineTime;

  if (
    currentTotalTimeProgress &&
    Math.abs(ytCurrentTime - currentTotalTimeProgress.value) >= map.currentTimeBarFrequency
  ) {
    currentTotalTimeProgress.value = ytCurrentTime;
  }

  if (scene === "replay") {
    if (count && lineTime) {
      replay(
        count,
        lineResults,
        gameStateRef,
        playingRef,
        map,
        lineTime,
        playingCenterRef,
        ytStateRef,
        statusRef,
        playingComboRef,
        tabStatusRef,
        playingLineTimeRef,
        inputMode,
        lineConstantTime,
        rankingScores,
        scene,
      );
    }
  }

  const displayRemainTime = playingLineTimeRef.current!.getRemainTime();
  if (
    Math.abs(Number(currentLine.time) / speedData.playSpeed - ytConstantTime - displayRemainTime) >=
    0.1
  ) {
    const currentPlayingCenterRef = playingCenterRef.current;

    if (!currentPlayingCenterRef) {
      return;
    }

    const lineWord = currentPlayingCenterRef!.getLineWord();
    const status = tabStatusRef.current!.getStatus();

    playingLineTimeRef.current?.setRemainTime(remainTime);

    if (lineWord.nextChar["k"]) {
      const typeSpeed = new CalcTypeSpeed("timer", status!, lineConstantTime, statusRef);
      playingLineTimeRef.current?.setLineKpm(typeSpeed.lineKpm);
    }

    const isRetrySkip = gameStateRef.current!.isRetrySkip;

    if (
      isRetrySkip &&
      Number(map.mapData[map.startLine]["time"]) - 3 * speedData.playSpeed <= ytCurrentTime
    ) {
      gameStateRef.current!.isRetrySkip = false;
    }

    skipGuideRef.current!.displaySkipGuide(
      lineWord.nextChar["k"],
      lineConstantTime,
      remainTime,
      skipGuideRef,
      isRetrySkip,
    );

    const currentTotalTime = playingTotalTimeRef.current!.getCurrentTime();

    if (Math.abs(ytCurrentTime - currentTotalTime) >= 1) {
      playingTotalTimeRef.current?.setCurrentTime(ytCurrentTime);
    }
  }

  if (
    ytCurrentTime >= Number(currentLine["time"]) ||
    ytCurrentTime >= ytStateRef.current!.movieEndTime
  ) {
    lineUpdate(
      playerRef,
      lineResults,
      setLineResults,
      map,
      statusRef,
      ytStateRef,
      gameStateRef,
      ytCurrentTime,
      tabStatusRef,
      playingCenterRef,
      playingLineTimeRef,
      playingComboRef,
      lineProgressRef,
      inputMode as InputModeType,
      speedData,
      rankingScores,
      lineConstantTime,
      count,
      currentLine,
      nextLine,
      playingRef,
      scene,
    );
  }
};

export const lineUpdate = (
  playerRef: React.RefObject<any>,
  lineResults: LineResultData[],
  setLineResults: React.Dispatch<React.SetStateAction<LineResultData[]>>,
  map: CreateMap,
  statusRef: React.RefObject<StatusRef>,
  ytStateRef: React.RefObject<YTStateRef>,
  gameStateRef: React.RefObject<GameStateRef>,
  ytCurrentTime: number,
  tabStatusRef: React.RefObject<TabStatusRef>,
  playingCenterRef: React.RefObject<PlayingCenterRef>,
  playingLineTimeRef: React.RefObject<PlayingLineTimeRef>,
  playingComboRef: React.RefObject<PlayingComboRef>,
  lineProgressRef: React.RefObject<HTMLProgressElement>,
  inputMode: InputModeType,
  speedData: Speed,
  rankingScores: number[],
  lineConstantTime: number,
  count: number,
  currentLine: LineData,
  nextLine: LineData,
  playingRef: React.RefObject<PlayingRef>,
  scene: SceneType,
) => {
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

  if (currentLine["lyrics"] === "end" || ytCurrentTime >= ytStateRef.current!.movieEndTime) {
    playerRef.current.stopVideo();
    typeTicker.stop();

    return;
  } else if (nextLine) {
    if (scene === "playing") {
      statusRef.current!.status.count += 1;
    } else {
      statusRef.current!.status.count = getLineCount(ytCurrentTime, map.mapData);
    }
    setNewLine(
      statusRef.current!.status.count,
      scene,
      statusRef,
      map,
      inputMode,
      speedData,
      playingLineTimeRef,
      playingCenterRef,
      lineProgressRef,
      lineResults,
      gameStateRef,
      playingRef,
    );
  }
};

export function setNewLine(
  newCount: number,
  scene: SceneType,
  statusRef: React.RefObject<StatusRef>,
  map: CreateMap,
  inputMode: InputModeType,
  speedData: Speed,
  playingLineTimeRef: React.RefObject<PlayingLineTimeRef>,
  playingCenterRef: React.RefObject<PlayingCenterRef>,
  lineProgressRef: React.RefObject<HTMLProgressElement>,
  lineResults: LineResultData[],
  gameStateRef: React.RefObject<GameStateRef>,
  playingRef: React.RefObject<PlayingRef>,
) {
  const currentCount = newCount ? newCount - 1 : 0;
  statusRef.current!.lineStatus = structuredClone({
    ...defaultStatusRef.lineStatus,
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
      lyrics: map.mapData[newCount]["lyrics"],
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

    progressElement.max =
      Number(map.mapData[newCount]["time"]) - Number(map.mapData[currentCount]["time"]);
  }

  if (scene === "replay") {
    lineReplayUpdate(lineResults, gameStateRef, playingRef, currentCount);
  }
}
