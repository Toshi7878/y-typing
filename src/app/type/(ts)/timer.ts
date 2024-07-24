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
import { GameStateRef, Speed, StatusRef, YTStateRef } from "./type";

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
) => {
  if (!map) {
    return;
  }
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
      console.log(`lineTime: ${lineTime} lineConstantTime${lineConstantTime}`);
      const typeSpeed = new CalcTypeSpeed(status!, lineConstantTime, statusRef);
      playingLineTimeRef.current?.setLineKpm(typeSpeed.lineTypeSpeed);
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

  if (nextLine && ytCurrentTime >= Number(currentLine["time"])) {
    const currentPlayingCenterRef = playingCenterRef.current;
    const status = tabStatusRef.current!.getStatus();

    const lineWord = currentPlayingCenterRef!.getLineWord();
    const typeSpeed = new CalcTypeSpeed(status!, lineConstantTime, statusRef);

    const lineResult = new LineResult(
      status!,
      statusRef,
      lineWord,
      map,
      lineTime,
      typeSpeed.totalTypeSpeed,
      rankingScores,
    );

    statusRef.current!.status.result.push({
      status: {
        point: status!.point,
        timeBonus: status!.timeBonus,
        type: status!.type,
        miss: status!.miss,
        combo: playingComboRef.current?.getCombo(),
        clearTime: statusRef.current!.lineStatus.lineClearTime,
        kpm: typeSpeed.lineTypeSpeed,
        rkpm: typeSpeed.lineTypeRkpm,
        lineKpm: playingLineTimeRef.current?.getLineKpm(),
      },
      typeResult: statusRef.current!.lineStatus.typeResult,
    });
    // statusKpmValueRef.current?.setKpm(typeSpeed.totalTypeSpeed);
    tabStatusRef.current!.setStatus(lineResult.newStatus);

    if (lineWord.nextChar["k"]) {
      statusRef.current!.status.totalTypeTime = lineResult.newTotalTime;
    }
    statusRef.current!.status.totalLatency += statusRef.current!.lineStatus.latency;

    statusRef.current!.status.count += 1;
    statusRef.current!.lineStatus = structuredClone(defaultStatusRef.lineStatus);
    playingLineTimeRef.current?.setLineKpm(0);
    statusRef.current!.lineStatus.latency = 0;
    currentPlayingCenterRef!.setLineWord({
      correct: { k: "", r: "" },
      nextChar: [...map.words[count].word][0],
      word: [...map.words[count].word].slice(1),
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
  }
};
