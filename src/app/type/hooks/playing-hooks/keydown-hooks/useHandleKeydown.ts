import { drawerClosureAtom } from "@/app/type/components/typing-area/TypingCard";
import { TIME_OFFSET_SHORTCUTKEY_RANGE } from "@/app/type/ts/const/typeDefaultValue";
import { useIsKeydownTyped } from "@/app/type/ts/scene-ts/playing/keydown/typingJudge";
import {
  inputModeAtom,
  lineWordAtom,
  sceneAtom,
  skipAtom,
  userOptionsAtom,
  useSetPlayingNotifyAtom,
  useSetTimeOffsetAtom,
} from "@/app/type/type-atoms/gameRenderAtoms";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import { UseDisclosureReturn } from "@chakra-ui/react";
import { useStore } from "jotai";
import { useVideoSpeedChange } from "../../useVideoSpeedChange";
import { useChangePlayMode } from "../useChangePlayMode";
import { useGamePause } from "../useGamePause";
import { useInputModeChange } from "../useInputModeChange";
import { useMoveLine } from "../useMoveLine";
import { usePressSkip } from "../usePressSkip";
import { useRetry } from "../useRetry";
import { useToggleLineList } from "../useToggleLineList";
import { useTyping } from "./useTyping";

export const useHandleKeydown = () => {
  const { ytStateRef, statusRef } = useRefs();
  const isKeydownTyped = useIsKeydownTyped();
  const typing = useTyping();
  const playingShortcutKey = usePlayingShortcutKey();
  const gamePause = useGamePause();
  const typeAtomStore = useStore();

  return (event: KeyboardEvent) => {
    const scene = typeAtomStore.get(sceneAtom);

    if (!ytStateRef.current?.isPaused || scene === "practice") {
      const count = statusRef.current!.status.count;
      const currentLineCount = count - 1;

      //ライン切り変えバグ回避(切り替わるギリギリでタイピングするとバグる)
      if (currentLineCount < 0) {
        return;
      }

      const lineWord = typeAtomStore.get(lineWordAtom);

      if (currentLineCount == lineWord.lineCount && isKeydownTyped(event) && scene !== "replay") {
        event.preventDefault();

        typing({
          event,
          count,
        });
      } else {
        playingShortcutKey(event);
      }
    } else if (event.key === "Escape") {
      gamePause();
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

    const drawerClosure = typeAtomStore.get(drawerClosureAtom) as UseDisclosureReturn;

    if ((event.ctrlKey && event.code == "KeyF" && !drawerClosure.isOpen) || event.altKey) {
      event.preventDefault();
    }
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
          moveNextLine(drawerClosure);
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
          movePrevLine(drawerClosure);
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
            toggleLineListDrawer();
          }
        }
        event.preventDefault();
        break;

      case "F4":
        retry();
        event.preventDefault();
        break;
      case "F7":
        changePlayMode();
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
            toggleLineListDrawer();
          }
        }
        event.preventDefault();
        break;
    }
  };
};
