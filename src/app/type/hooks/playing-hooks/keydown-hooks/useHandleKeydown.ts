import { useIsKeydownTyped } from "@/app/type/ts/scene-ts/playing/keydown/typing";
import { lineWordAtom, sceneAtom } from "@/app/type/type-atoms/gameRenderAtoms";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import { useTyping, usePlayingShortcutKey } from "./useTyping";
import { useGamePause } from "../useGamePause";
import { useStore } from "jotai";

export const useHandleKeydown = () => {
  const { ytStateRef, statusRef } = useRefs();
  const isKeydownTyped = useIsKeydownTyped();
  const typing = useTyping();
  const playingShortcutKey = usePlayingShortcutKey();
  const gamePause = useGamePause();
  const typeAtomStore = useStore();

  return (event: KeyboardEvent) => {
    if (!ytStateRef.current?.isPaused) {
      const count = statusRef.current!.status.count;
      const currentLineCount = count - 1;

      //ライン切り変えバグ回避(切り替わるギリギリでタイピングするとバグる)
      if (currentLineCount < 0) {
        return;
      }

      const lineWord = typeAtomStore.get(lineWordAtom);
      const scene = typeAtomStore.get(sceneAtom);

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
