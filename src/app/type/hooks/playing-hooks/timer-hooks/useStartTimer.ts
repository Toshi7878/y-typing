import { InputModeType } from "@/app/type/ts/type";
import {
  readyRadioInputModeAtom,
  useSetPlayingInputModeAtom,
} from "@/app/type/type-atoms/gameRenderAtoms";
import { useStore } from "jotai";
import { typeTicker } from "../../useYoutubeEvents";

export const useStartTimer = () => {
  const typeAtomStore = useStore();
  const setPlayingInputMode = useSetPlayingInputModeAtom();

  return () => {
    if (!typeTicker.started) {
      const readyInputMode = typeAtomStore.get(readyRadioInputModeAtom);
      setPlayingInputMode(readyInputMode.replace(/""/g, '"') as InputModeType);
      typeTicker.start();
    }
  };
};
