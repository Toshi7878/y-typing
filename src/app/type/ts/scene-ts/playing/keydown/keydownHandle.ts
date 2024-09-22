import { SkipGuideRef } from "@/app/type/components/typing-area/scene/playing-child/child/PlayingSkipGuide";
import { WordType } from "../../../type";
import { updateReplayStatus } from "../replay";
import { Miss, Success, Typing } from "./typing";
import { CalcTypeSpeed } from "../calcTypeSpeed";
import { CreateMap } from "../../ready/createTypingWord";
import { useRetry } from "@/app/type/hooks/playing-hooks/useRetry";
import { usePressSkip } from "@/app/type/hooks/playing-hooks/usePressSkip";
import { useRealTimeSpeedChange } from "@/app/type/hooks/playing-hooks/useSpeedChange";
import { useGamePause } from "@/app/type/hooks/playing-hooks/useGamePause";
import { useInputModeChange } from "@/app/type/hooks/playing-hooks/useInputModeChange";
import { useToggleLineList } from "@/app/type/hooks/playing-hooks/useToggleLineList";
import { useChangePlayMode } from "@/app/type/hooks/playing-hooks/useChangePlayMode";
import { useChangePracticeSpeed } from "@/app/type/hooks/playing-hooks/usePracticeSpeedChange";
import { useMoveLine } from "@/app/type/hooks/playing-hooks/useMoveLine";
import {
  useInputModeAtom,
  useLineResultsAtom,
  useMapAtom,
  useRankingScoresAtom,
  useSceneAtom,
  useSetLineResultsAtom,
  useTypePageSpeedAtom,
} from "@/app/type/type-atoms/gameRenderAtoms";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import { UseDisclosureReturn } from "@chakra-ui/react";

interface HandleTypingParams {
  event: KeyboardEvent;
  cloneLineWord: WordType;
  lineTime: number;
  count: number;
}

export const useHandleTyping = () => {
  const {
    playingComboRef,
    tabStatusRef,
    statusRef,
    playingLineTimeRef,
    ytStateRef,
    playingCenterRef,
  } = useRefs();

  const map = useMapAtom() as CreateMap;
  const scene = useSceneAtom();
  const speedData = useTypePageSpeedAtom();
  const inputMode = useInputModeAtom();
  const rankingScores = useRankingScoresAtom();
  const lineResults = useLineResultsAtom();
  const setLineResults = useSetLineResultsAtom();
  return ({ event, cloneLineWord, lineTime, count }: HandleTypingParams) => {
    const result = new Typing({ event, lineWord: cloneLineWord, inputMode });
    const lineConstantTime = Math.round((lineTime / speedData.playSpeed) * 1000) / 1000;

    const status = tabStatusRef.current!.getStatus();

    if (result.successKey) {
      const nextLine = map!.mapData[count];
      const currentLine = map!.mapData[count - 1];
      const movieDuration = ytStateRef.current!.movieDuration;
      const nextLineTime = nextLine.time > movieDuration ? movieDuration : nextLine.time;

      const remainTime = nextLineTime - currentLine.time - lineConstantTime;
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
      const miss = new Miss(
        status,
        statusRef,
        result.failKey,
        playingComboRef,
        lineConstantTime,
        map!,
      );
      tabStatusRef.current!.setStatus(miss.newStatus);
    }
  };
};

const disableKeys = ["Home", "End", "PageUp", "PageDown", "CapsLock", "Backquote", "F3", "Space"];

const keyWhiteList = ["F5"];

export const usePlayShortcutKey = () => {
  const { statusRef } = useRefs();
  const scene = useSceneAtom();
  const inputMode = useInputModeAtom();
  const retry = useRetry();
  const pressSkip = usePressSkip();
  const realTimeSpeedChange = useRealTimeSpeedChange();
  const gamePause = useGamePause();
  const inputModeChange = useInputModeChange();
  const toggleLineListDrawer = useToggleLineList();
  const changePlayMode = useChangePlayMode();
  const changePracticeSpeed = useChangePracticeSpeed();
  const { movePrevLine, moveNextLine, moveSetLine } = useMoveLine();

  return (
    event: KeyboardEvent,
    skipGuideRef: React.RefObject<SkipGuideRef>,
    lineTime: number,
    drawerClosure: UseDisclosureReturn,
  ) => {
    //間奏スキップ
    const skip = skipGuideRef.current?.getSkipGuide?.();

    if (
      disableKeys.includes(event.code) ||
      (event.ctrlKey && event.code == "KeyF" && !drawerClosure.isOpen) ||
      event.altKey
    ) {
      event.preventDefault();
    } else if (keyWhiteList.includes(event.code) || (event.ctrlKey && event.code == "KeyC")) {
      return;
    }

    switch (event.code) {
      case "Escape": //Escでポーズ
        gamePause();
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
          moveNextLine(drawerClosure);
        }
        event.preventDefault();
        break;
      case "ArrowLeft":
        if (scene === "replay" || scene === "practice") {
          movePrevLine(drawerClosure);
        }
        event.preventDefault();
        break;
      case skip:
        pressSkip(skipGuideRef);
        event.preventDefault();
        break;
      case "F4":
        retry();
        event.preventDefault();
        break;
      case "F7":
        changePlayMode(drawerClosure);
        event.preventDefault();
        break;
      case "F9": //F9で低速(練習モード)
        if (scene === "practice") {
          changePracticeSpeed("down");
        }
        event.preventDefault();
        break;
      case "F10":
        if (scene === "playing") {
          realTimeSpeedChange();
          statusRef.current!.lineStatus.typeResult.push({
            op: "speedChange",
            t: Math.round(lineTime * 1000) / 1000,
          });
        } else if (scene === "practice") {
          changePracticeSpeed("up");
        }
        event.preventDefault();
        break;
      case "KanaMode":
      case "Romaji":
        if (scene !== "replay") {
          if (inputMode === "roma") {
            inputModeChange("kana");
            statusRef.current!.lineStatus.typeResult.push({
              op: "kana",
              t: Math.round(lineTime * 1000) / 1000,
            });
          } else {
            inputModeChange("roma");
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
          moveSetLine();
        }
        event.preventDefault();
        break;

      case "Tab":
        if (scene === "replay" || scene === "practice") {
          toggleLineListDrawer(drawerClosure);
        }
        event.preventDefault();
        break;
    }
  };
};
