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
  LineResultObj,
  PlayingRef,
  SceneType,
  Speed,
  StatusRef,
  YTStateRef,
} from "./type";
import { ticker } from "../components/(typing-area)/scene/Playing";
import { CharsType, KanaInput, Miss, RomaInput, Success } from "./keydown";
import { updateReplayStatus } from "./replay";

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
  const lineConstantTime = lineTime / speedData.playSpeed;
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
      const typeSpeed = new CalcTypeSpeed(status!, lineConstantTime, statusRef);
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
      lineTime,
      count,
      currentLine,
      nextLine,
      playingRef,
      scene,
    );
  }
};

const replay = (
  count: number,
  gameStateRef: React.RefObject<GameStateRef>,
  playingRef: React.RefObject<PlayingRef>,
  map: CreateMap,
  lineTime: number,
  playingCenterRef: React.RefObject<PlayingCenterRef>,
  ytStateRef: React.RefObject<YTStateRef>,
  statusRef: React.RefObject<StatusRef>,
  playingComboRef: React.RefObject<PlayingComboRef>,
  tabStatusRef: React.RefObject<TabStatusRef>,
  playingLineTimeRef: React.RefObject<PlayingLineTimeRef>,
  inputMode: string,
  lineConstantTime: number,
  rankingScores: number[],
  scene: SceneType,
) => {
  const lineResult: LineResultObj = gameStateRef.current?.replayData[count - 1];
  const typeResults = lineResult.typeResult;

  if (typeResults.length === 0) {
    return;
  }
  const keyCount = gameStateRef.current?.replayKeyCount!;

  const typeData = typeResults[keyCount];

  if (!typeData) {
    return;
  }

  const keyTime = typeData.t;

  if (lineTime >= keyTime) {
    const key = typeData.c;
    const isSuccess = typeData.is;
    const option = typeData.op;
    if (key) {
      const lineWord = playingCenterRef.current!.getLineWord();
      const chars: CharsType = {
        keys: [key],
        key: key,
      };
      const status = tabStatusRef.current!.getStatus();

      if (isSuccess) {
        console.log("update replay Success");

        const result =
          inputMode === "roma"
            ? new RomaInput({ chars, lineWord })
            : new KanaInput({ chars, lineWord });
        const currentLine = map!.words[count];
        const remainTime = Number(currentLine.time) - ytStateRef.current!.currentTime;

        if (result.newLineWord.nextChar["k"]) {
          const typeSpeed = new CalcTypeSpeed(status!, lineConstantTime, statusRef);
          const success = new Success(
            status,
            statusRef,
            result.successKey,
            lineConstantTime,
            playingComboRef,
            inputMode as InputModeType,
            result.updatePoint,
            result.newLineWord,
            map!,
            lineTime,
            typeSpeed.totalKpm,
            remainTime,
            rankingScores,
            scene,
          );

          tabStatusRef.current!.setStatus(success.newStatus);
          playingLineTimeRef.current?.setLineKpm(typeSpeed.lineKpm);
        } else {
          const newStatus = updateReplayStatus(
            count,
            gameStateRef.current!.replayData,
            map,
            rankingScores,
          );
          newStatus.point = lineResult.status!.p as number;
          newStatus.timeBonus = lineResult.status!.tBonus as number;

          tabStatusRef.current!.setStatus(newStatus);
          playingComboRef.current?.setCombo(lineResult.status!.combo as number);
          playingLineTimeRef.current?.setLineKpm(lineResult.status!.lKpm as number);
          statusRef.current!.status.totalTypeTime = lineResult.status!.tTime;
        }

        playingCenterRef.current!.setLineWord(result.newLineWord);
      } else {
        console.log("update replay failed");
        const miss = new Miss(status, statusRef, key, playingComboRef, lineTime);
        tabStatusRef.current!.setStatus(miss.newStatus);
      }
    } else if (option) {
      console.log("update replay option");

      switch (option) {
        case "roma":
          playingRef.current?.inputModeChange("roma");
          break;
        case "kana":
          playingRef.current?.inputModeChange("kana");
          break;
        case "speedChange":
          playingRef.current!.realtimeSpeedChange();
          break;
      }
    }

    gameStateRef.current!.replayKeyCount++;
  }
};

const lineReplayUpdate = (
  gameStateRef: React.RefObject<GameStateRef>,
  playingRef: React.RefObject<PlayingRef>,
  count: number,
) => {
  const lineResult = gameStateRef.current?.replayData[count - 1];
  const lineInputMode = lineResult.status.mode;
  const speed = lineResult.status.sp;

  playingRef.current?.inputModeChange(lineInputMode);
  playingRef.current?.setRealTimeSpeed(speed);

  gameStateRef.current!.replayKeyCount = 0;
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
  lineTime: number,
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
      lineTime,
      typeSpeed.totalKpm,
      rankingScores,
    );

    if (count > 0) {
      if (lineWord.nextChar["k"]) {
        statusRef.current!.status.totalTypeTime = lineResult.newTotalTime;
      }
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
            cTime: statusRef.current!.lineStatus.lineClearTime,
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
    console.log("end");
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
