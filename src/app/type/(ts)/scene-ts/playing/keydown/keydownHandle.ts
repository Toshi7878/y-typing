import { SkipGuideRef } from "@/app/type/components/(typing-area)/scene/playing-child/child/PlayingSkipGuide";
import {
  InputModeType,
  LineResultData,
  PlayingRef,
  SceneType,
  Speed,
  StatusRef,
  WordType,
  YTStateRef,
} from "../../../type";
import { updateReplayStatus } from "../replay";
import { Miss, Success, Typing } from "./typing";
import { CalcTypeSpeed } from "../calcTypeSpeed";
import { RefObject } from "react";
import { TabStatusRef } from "@/app/type/components/(tab)/tab/TabStatus";
import { PlayingComboRef } from "@/app/type/components/(typing-area)/scene/playing-child/child/PlayingCombo";
import { PlayingCenterRef } from "@/app/type/components/(typing-area)/scene/playing-child/PlayingCenter";
import { PlayingLineTimeRef } from "@/app/type/components/(typing-area)/scene/playing-child/child/PlayingLineTime";
import { CreateMap } from "../../ready/createTypingWord";

interface HandleTypingParams {
  event: KeyboardEvent;
  cloneLineWord: WordType;
  inputMode: InputModeType;
  lineTime: number;
  speedData: Speed;
  tabStatusRef: RefObject<TabStatusRef>;
  map: CreateMap;
  count: number;
  statusRef: RefObject<StatusRef>;
  playingComboRef: RefObject<PlayingComboRef>;
  rankingScores: number[];
  scene: SceneType;
  playingCenterRef: RefObject<PlayingCenterRef>;
  playingLineTimeRef: RefObject<PlayingLineTimeRef>;
  lineResults: LineResultData[];
  setLineResults: (results: LineResultData[]) => void;
}
export function handleTyping({
  event,
  cloneLineWord,
  inputMode,
  lineTime,
  speedData,
  tabStatusRef,
  map,
  count,
  statusRef,
  playingComboRef,
  rankingScores,
  scene,
  playingCenterRef,
  playingLineTimeRef,
  lineResults,
  setLineResults,
}: HandleTypingParams) {
  const result = new Typing({ event, lineWord: cloneLineWord, inputMode });
  const lineConstantTime = Math.round((lineTime / speedData.playSpeed) * 1000) / 1000;

  const status = tabStatusRef.current!.getStatus();

  if (result.successKey) {
    const currentLine = map!.mapData[count];
    const prevLine = map!.mapData[count - 1];
    const remainTime = Number(currentLine.time) - Number(prevLine.time) - lineConstantTime;
    const typeSpeed = new CalcTypeSpeed("keydown", status!, lineConstantTime, statusRef);

    const success = new Success(
      status,
      statusRef,
      result.successKey,
      lineConstantTime,
      playingComboRef,
      inputMode,
      result.updatePoint,
      result.newLineWord,
      map!,
      typeSpeed.totalKpm,
      remainTime,
      rankingScores,
      scene,
    );

    playingCenterRef.current!.setLineWord(result.newLineWord);
    playingLineTimeRef.current?.setLineKpm(typeSpeed.lineKpm);

    if (scene === "practice" && speedData.playSpeed >= 1 && !result.newLineWord.nextChar["k"]) {
      const combo = playingComboRef.current!.getCombo();
      const tTime = Math.round(statusRef.current!.status.totalTypeTime * 1000) / 1000;
      const mode = statusRef.current!.lineStatus.lineStartInputMode;
      const sp = statusRef.current!.lineStatus.lineStartSpeed;
      const typeResult = statusRef.current!.lineStatus.typeResult;
      const lResult = lineResults[count - 1];
      const lMiss = statusRef.current!.lineStatus.lineMiss;
      const lineScore = success.newStatus.point + success.newStatus.timeBonus + lMiss * 5;
      const oldLineScore =
        lResult.status!.p! + lResult.status!.tBonus! + lResult.status!.lMiss! * 5;

      const isUpdateResult = lineScore >= oldLineScore;
      const newLineResults = [...lineResults];

      if (isUpdateResult) {
        newLineResults[count - 1] = {
          status: {
            p: success.newStatus.point,
            tBonus: success.newStatus.timeBonus,
            lType: statusRef.current!.lineStatus.lineType,
            lMiss,
            lRkpm: typeSpeed.lineRkpm,
            lKpm: typeSpeed.lineKpm,
            lostW: "",
            lLost: 0,
            combo,
            tTime,
            mode,
            sp,
          },
          typeResult,
        };
        setLineResults(newLineResults);
      }
      const newStatus = updateReplayStatus(
        map!.mapData.length - 1,
        newLineResults,
        map!,
        rankingScores,
      );
      tabStatusRef.current!.setStatus({
        ...newStatus,
        point: success.newStatus.point,
        timeBonus: success.newStatus.timeBonus,
      });
    } else {
      tabStatusRef.current!.setStatus(success.newStatus);
    }
  } else if (result.newLineWord.correct["r"] || result.newLineWord.correct["k"]) {
    const miss = new Miss(status, statusRef, result.failKey, playingComboRef, lineConstantTime);
    tabStatusRef.current!.setStatus(miss.newStatus);
  }
}

const disableKeys = ["Home", "End", "PageUp", "PageDown", "CapsLock", "Backquote", "F3", "Space"];

const keyWhiteList = ["F5"];

export function shortcutKey(
  event: KeyboardEvent,
  skipGuideRef: React.RefObject<SkipGuideRef>,
  playingRef: React.RefObject<PlayingRef>,
  statusRef: React.RefObject<StatusRef>,
  inputMode: InputModeType,
  lineTime: number,
  scene: SceneType,
  isOpen: boolean,
) {
  //間奏スキップ
  const skip = skipGuideRef.current?.getSkipGuide?.();

  if (
    disableKeys.includes(event.code) ||
    (event.ctrlKey && event.code == "KeyF" && !isOpen) ||
    event.altKey
  ) {
    event.preventDefault();
  } else if (keyWhiteList.includes(event.code) || (event.ctrlKey && event.code == "KeyC")) {
    return;
  }

  switch (event.code) {
    case "Escape": //Escでポーズ
      playingRef.current!.gamePause();
      event.preventDefault();
      break;
    case "ArrowUp":
      event.preventDefault();
      break;
    case "ArrowDown":
      event.preventDefault();
      break;
    case "ArrowRight":
      if (scene === "replay" || scene === "practice") {
        playingRef.current!.nextLine();
      }
      event.preventDefault();
      break;
    case "ArrowLeft":
      if (scene === "replay" || scene === "practice") {
        playingRef.current!.prevLine();
      }
      event.preventDefault();
      break;
    case skip:
      playingRef.current!.pressSkip();
      event.preventDefault();
      break;
    case "F4":
      playingRef.current!.retry();
      event.preventDefault();
      break;
    case "F7":
      playingRef.current!.changePlayMode();
      event.preventDefault();
      break;
    case "F9": //F9で低速(練習モード)
      if (scene === "practice") {
        playingRef.current!.practiceSpeedDown();
      }
      event.preventDefault();
      break;
    case "F10":
      if (scene === "playing") {
        playingRef.current!.realtimeSpeedChange();
        statusRef.current!.lineStatus.typeResult.push({
          op: "speedChange",
          t: Math.round(lineTime * 1000) / 1000,
        });
      } else if (scene === "practice") {
        playingRef.current!.practiceSpeedUp();
      }
      event.preventDefault();
      break;
    case "KanaMode":
    case "Romaji":
      if (scene !== "replay") {
        if (inputMode === "roma") {
          playingRef.current!.inputModeChange("kana");
          statusRef.current!.lineStatus.typeResult.push({
            op: "kana",
            t: Math.round(lineTime * 1000) / 1000,
          });
        } else {
          playingRef.current!.inputModeChange("roma");
          statusRef.current!.lineStatus.typeResult.push({
            op: "roma",
            t: Math.round(lineTime * 1000) / 1000,
          });
        }
      }
      event.preventDefault();
      break;
    case "Backspace":
      if (scene === "replay" || scene === "practice") {
        playingRef.current!.practiceSetLine();
      }
      event.preventDefault();
      break;

    case "Tab":
      if (scene === "replay" || scene === "practice") {
        playingRef.current!.openLineList();
      }
      event.preventDefault();
      break;
  }
}
