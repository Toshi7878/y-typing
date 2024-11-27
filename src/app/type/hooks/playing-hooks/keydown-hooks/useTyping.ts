import { Status } from "../../../ts/type";
import { updateReplayStatus } from "../timer-hooks/replayHooks";
import { Typing, useTypeMiss, useTypeSuccess } from "../../../ts/scene-ts/playing/keydown/typing";
import { CreateMap } from "../../../ts/scene-ts/ready/createTypingWord";
import { useRetry } from "@/app/type/hooks/playing-hooks/useRetry";
import { usePressSkip } from "@/app/type/hooks/playing-hooks/usePressSkip";
import { useGamePause } from "@/app/type/hooks/playing-hooks/useGamePause";
import { useInputModeChange } from "@/app/type/hooks/playing-hooks/useInputModeChange";
import { useToggleLineList } from "@/app/type/hooks/playing-hooks/useToggleLineList";
import { useChangePlayMode } from "@/app/type/hooks/playing-hooks/useChangePlayMode";
import { useMoveLine } from "@/app/type/hooks/playing-hooks/useMoveLine";
import {
  comboAtom,
  inputModeAtom,
  lineResultsAtom,
  lineWordAtom,
  rankingScoresAtom,
  sceneAtom,
  skipAtom,
  speedAtom,
  useComboAtom,
  useInputModeAtom,
  useLineResultsAtom,
  useLineWordAtom,
  useMapAtom,
  useRankingScoresAtom,
  userOptionsAtom,
  useSceneAtom,
  useSetLineResultsAtom,
  useSetPlayingNotifyAtom,
  useSetTimeOffsetAtom,
  useSkipAtom,
  useUserOptionsAtom,
} from "@/app/type/type-atoms/gameRenderAtoms";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import { useSoundEffect } from "@/app/type/hooks/playing-hooks/useSoundEffect";
import { TIME_OFFSET_SHORTCUTKEY_RANGE } from "../../../ts/const/typeDefaultValue";
import { useVideoSpeedChange } from "../../useVideoSpeedChange";
import { useGetTime } from "../../useGetTime";
import { useCalcTypeSpeed } from "../../../ts/scene-ts/playing/calcTypeSpeed";
import { useStore } from "jotai";

interface HandleTypingParams {
  event: KeyboardEvent;
  count: number;
}

export const useTyping = () => {
  const { tabStatusRef, statusRef } = useRefs();

  const map = useMapAtom() as CreateMap;
  const typeAtomStore = useStore();

  const setLineResults = useSetLineResultsAtom();
  const { triggerTypingSound, triggerMissSound } = useSoundEffect();
  const { updateSuccessStatus, updateSuccessStatusRefs } = useTypeSuccess();
  const { updateMissStatus, updateMissRefStatus } = useTypeMiss();
  const {
    getCurrentLineTime,
    getCurrentOffsettedYTTime,
    getConstantLineTime,
    getConstantRemainLineTime,
  } = useGetTime();
  const calcTypeSpeed = useCalcTypeSpeed();

  return ({ event, count }: HandleTypingParams) => {
    const lineWord = typeAtomStore.get(lineWordAtom);
    const inputMode = typeAtomStore.get(inputModeAtom);

    const result = new Typing({ event, lineWord, inputMode });
    const lineTime = getCurrentLineTime(getCurrentOffsettedYTTime());
    const constantLineTime = getConstantLineTime(lineTime);

    const status: Status = tabStatusRef.current!.getStatus();

    if (result.successKey) {
      const lineRemainConstantTime = getConstantRemainLineTime(constantLineTime);
      const typeSpeed = calcTypeSpeed({
        updateType: "keydown",
        constantLineTime,
        totalTypeCount: status.type,
      });
      updateSuccessStatusRefs({
        constantLineTime,
        newLineWord: result.newLineWord,
        successKey: result.successKey,
        newLineKpm: typeSpeed.lineKpm,
      });

      const newStatus = updateSuccessStatus({
        newLineWord: result.newLineWord,
        lineRemainConstantTime,
        updatePoint: result.updatePoint,
        totalKpm: typeSpeed.totalKpm,
        status,
      });

      const isLineCompleted = !result.newLineWord.nextChar["k"];
      triggerTypingSound({ isLineCompleted });

      const playSpeed = typeAtomStore.get(speedAtom).playSpeed;

      const scene = typeAtomStore.get(sceneAtom);

      if (scene === "practice" && playSpeed >= 1 && !result.newLineWord.nextChar["k"]) {
        const lineResults = typeAtomStore.get(lineResultsAtom);

        const tTime = Math.round(statusRef.current!.status.totalTypeTime * 1000) / 1000;
        const mode = statusRef.current!.lineStatus.lineStartInputMode;
        const sp = statusRef.current!.lineStatus.lineStartSpeed;
        const typeResult = statusRef.current!.lineStatus.typeResult;
        const lResult = lineResults[count - 1];
        const lMiss = statusRef.current!.lineStatus.lineMiss;
        const lineScore = newStatus.point + newStatus.timeBonus + lMiss * 5;
        const oldLineScore =
          lResult.status!.p! + lResult.status!.tBonus! + lResult.status!.lMiss! * 5;

        const isUpdateResult = lineScore >= oldLineScore;
        const newLineResults = [...lineResults];

        if (isUpdateResult) {
          const combo = typeAtomStore.get(comboAtom);

          newLineResults[count - 1] = {
            status: {
              p: newStatus.point,
              tBonus: newStatus.timeBonus,
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

        const rankingScores = typeAtomStore.get(rankingScoresAtom);

        const newStatusReplay = updateReplayStatus(
          map!.mapData.length - 1,
          newLineResults,
          map!,
          rankingScores,
        );
        tabStatusRef.current!.setStatus({
          ...newStatusReplay,
          point: newStatus.point,
          timeBonus: newStatus.timeBonus,
        });
      } else {
        tabStatusRef.current!.setStatus(newStatus);
      }
    } else if (result.newLineWord.correct["r"] || result.newLineWord.correct["k"]) {
      const newStatus = updateMissStatus(status);
      updateMissRefStatus({ constantLineTime, failKey: result.failKey });
      tabStatusRef.current!.setStatus(newStatus);

      triggerMissSound();
    }
  };
};

const keyWhiteList = ["F5"];

export const usePlayingShortcutKey = () => {
  const typeAtomStore = useStore();

  const retry = useRetry();
  const pressSkip = usePressSkip();
  const gamePause = useGamePause();
  const inputModeChange = useInputModeChange();
  const toggleLineListDrawer = useToggleLineList();
  const changePlayMode = useChangePlayMode();
  const { defaultSpeedChange, playingSpeedChange } = useVideoSpeedChange();
  const { movePrevLine, moveNextLine, moveSetLine } = useMoveLine();
  const setTimeOffset = useSetTimeOffsetAtom();
  const setNotify = useSetPlayingNotifyAtom();

  return (event: KeyboardEvent) => {
    //間奏スキップ
    const userOptions = typeAtomStore.get(userOptionsAtom);
    const scene = typeAtomStore.get(sceneAtom);
    const inputMode = typeAtomStore.get(inputModeAtom);
    const skip = typeAtomStore.get(skipAtom);

    const isCtrlLeftRight = userOptions.timeOffsetKey === "ctrl-left-right" && event.ctrlKey;
    const isCtrlAltLeftRight =
      userOptions.timeOffsetKey === "ctrl-alt-left-right" && event.ctrlKey && event.altKey;

    // if ((event.ctrlKey && event.code == "KeyF" && !drawerClosure.isOpen) || event.altKey) {
    //   event.preventDefault();
    // }
    if (keyWhiteList.includes(event.code) || (event.ctrlKey && event.code == "KeyC")) {
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
        if (isCtrlLeftRight || isCtrlAltLeftRight) {
          setTimeOffset((prev) => {
            const newValue = Math.round((prev + TIME_OFFSET_SHORTCUTKEY_RANGE) * 100) / 100;
            setNotify(Symbol(`時間調整:${(newValue + userOptions.timeOffset).toFixed(2)}`));
            return newValue;
          });
        } else if (scene === "replay" || scene === "practice") {
          // moveNextLine(drawerClosure);
        }

        event.preventDefault();
        break;
      case "ArrowLeft":
        if (isCtrlLeftRight || isCtrlAltLeftRight) {
          setTimeOffset((prev) => {
            const newValue = Math.round((prev - TIME_OFFSET_SHORTCUTKEY_RANGE) * 100) / 100;
            setNotify(Symbol(`時間調整:${(newValue + userOptions.timeOffset).toFixed(2)}`));
            return newValue;
          });
        } else if (scene === "replay" || scene === "practice") {
          // movePrevLine(drawerClosure);
        }
        event.preventDefault();
        break;
      case skip:
        pressSkip();
        event.preventDefault();
        break;
      case "F1":
        if (userOptions.toggleInputModeKey === "tab") {
          if (scene === "replay" || scene === "practice") {
            // toggleLineListDrawer(drawerClosure);
          }
        }
        event.preventDefault();
        break;

      case "F4":
        retry();
        event.preventDefault();
        break;
      case "F7":
        // changePlayMode(drawerClosure);
        event.preventDefault();
        break;
      case "F9":
        if (scene === "practice") {
          defaultSpeedChange("down");
        }
        event.preventDefault();
        break;
      case "F10":
        if (scene === "playing") {
          playingSpeedChange();
        } else if (scene === "practice") {
          defaultSpeedChange("up");
        }
        event.preventDefault();
        break;
      case "KanaMode":
      case "Romaji":
        if (userOptions.toggleInputModeKey === "alt-kana") {
          if (scene !== "replay") {
            if (inputMode === "roma") {
              inputModeChange("kana");
            } else {
              inputModeChange("roma");
            }
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
        if (userOptions.toggleInputModeKey === "tab") {
          if (scene !== "replay") {
            if (inputMode === "roma") {
              inputModeChange("kana");
            } else {
              inputModeChange("roma");
            }
          }
        } else {
          if (scene === "replay" || scene === "practice") {
            // toggleLineListDrawer(drawerClosure);
          }
        }
        event.preventDefault();
        break;
    }
  };
};
