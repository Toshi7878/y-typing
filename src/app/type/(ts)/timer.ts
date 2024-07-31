import { TabStatusRef } from "../components/(tab)/tab/TabStatus";
import { PlayingComboRef } from "../components/(typing-area)/scene/child/child/PlayingCombo";
import { PlayingLineTimeRef } from "../components/(typing-area)/scene/child/child/PlayingLineTime";
import { SkipGuideRef } from "../components/(typing-area)/scene/child/child/PlayingSkipGuide";
import { PlayingTotalTimeRef } from "../components/(typing-area)/scene/child/child/PlayingTotalTime";
import { PlayingCenterRef } from "../components/(typing-area)/scene/child/PlayingCenter";
import { CalcTypeSpeed } from "./calcTypeSpeed";
import { defaultStatusRef } from "@/app/type/(contexts)/refsProvider";

import { CreateMap } from "./createTypingWord";
import { LineResult } from "./lineResult";
import {
  GameStateRef,
  InputModeType,
  LineData,
  PlayingRef,
  SceneType,
  Speed,
  StatusRef,
  YTStateRef,
} from "./type";
import { ticker } from "../components/(typing-area)/scene/Playing";
import { lineReplayUpdate, replay, updateReplayStatus } from "./replay";

export const updateTimer = (
  map: CreateMap,
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
  const prevLine = map.words[count - 1];
  const currentLine = map.words[count];
  const nextLine = map.words[count + 1];
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
      Number(map.words[map.startLine]["time"]) - 3 * speedData.playSpeed <= ytCurrentTime
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

  if (scene === "playing") {
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
      const combo = playingComboRef.current?.getCombo();

      if (map.words[count - 1].kpm.r > 0) {
        statusRef.current!.status.result.push({
          status: {
            p: status!.point,
            tBonus: status!.timeBonus,
            lType: statusRef.current!.lineStatus.lineType,
            lMiss: statusRef.current!.lineStatus.lineMiss,
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
        });
      } else {
        //間奏ライン
        statusRef.current!.status.result.push({
          status: {
            combo,
            tTime,
            mode,
            sp,
          },
          typeResult,
        });
      }
    }

    console.log(statusRef.current!.status.result);
    tabStatusRef.current!.setStatus(lineResult.newStatus);
  } else if (scene === "replay") {
    const newStatus = updateReplayStatus(
      count,
      gameStateRef.current!.replayData,
      map,
      rankingScores,
    );
    tabStatusRef.current!.setStatus(newStatus);
    if (count > 0) {
      const lineResult = gameStateRef.current!.replayData[count - 1];
      playingComboRef.current?.setCombo(lineResult.status!.combo as number);
      statusRef.current!.status.totalTypeTime = lineResult.status!.tTime;
    }
  }

  if (currentLine["lyrics"] === "end" || ytCurrentTime >= ytStateRef.current!.movieEndTime) {
    playerRef.current.stopVideo();
    ticker.stop();

    return;
  } else if (nextLine) {
    statusRef.current!.status.count += 1;
    statusRef.current!.lineStatus = structuredClone({
      ...defaultStatusRef.lineStatus,
      lineStartSpeed: speedData.playSpeed,
      lineStartInputMode: inputMode,
    });
    playingLineTimeRef.current?.setLineKpm(0);
    statusRef.current!.lineStatus.latency = 0;
    currentPlayingCenterRef!.setLineWord({
      correct: { k: "", r: "" },
      nextChar: [...structuredClone(map.words[count].word)][0],
      word: [...structuredClone(map.words[count].word)].slice(1),
      lineCount: count,
    });

    currentPlayingCenterRef!.setLyrics(currentLine["lyrics"]);

    const nextKpm =
      (inputMode === "roma" ? map.words[count + 1].kpm["r"] : map.words[count + 1].kpm["k"]) *
      speedData.playSpeed;
    if (nextKpm) {
      currentPlayingCenterRef!.setNextLyrics({
        lyrics: nextLine["lyrics"],
        kpm: nextKpm.toFixed(0),
      });
    } else {
      currentPlayingCenterRef!.setNextLyrics({
        lyrics: "",
        kpm: "",
      });
    }

    if (lineProgressRef.current) {
      const progressElement = lineProgressRef.current as HTMLProgressElement;

      progressElement.max = Number(nextLine["time"]) - Number(currentLine["time"]);
    }

    if (scene === "replay") {
      lineReplayUpdate(gameStateRef, playingRef, statusRef.current!.status.count);
    }
  }
};
