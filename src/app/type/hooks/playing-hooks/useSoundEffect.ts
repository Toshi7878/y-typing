import useSound from "use-sound";
import clearTypeSound from "@/asset/wav/clear_type.wav";
import typeSound from "@/asset/wav/key_type.wav";
import missSound from "@/asset/wav/miss_type.wav";
import { useVolumeAtom } from "@/components/atom/globalAtoms";
import { useStore } from "jotai";
import { userOptionsAtom } from "../../type-atoms/gameRenderAtoms";

export const useSoundEffect = () => {
  const volume = useVolumeAtom();

  const typeAtomStore = useStore();

  const [clearTypeSoundPlay] = useSound(clearTypeSound, { volume: volume / 100 });
  const [typeSoundPlay] = useSound(typeSound, { volume: volume / 100 });
  const [missSoundPlay] = useSound(missSound, { volume: volume / 100 });

  const triggerTypingSound = ({ isLineCompleted }: { isLineCompleted: boolean }) => {
    const userOptions = typeAtomStore.get(userOptionsAtom);
    console.log(userOptions);
    if (isLineCompleted) {
      if (userOptions.lineClearSound) {
        clearTypeSoundPlay();
      } else if (userOptions.typeSound) {
        typeSoundPlay();
      }
    } else {
      if (userOptions.typeSound) {
        typeSoundPlay();
      }
    }
  };

  const triggerMissSound = () => {
    const userOptions = typeAtomStore.get(userOptionsAtom);
    if (userOptions.missSound) {
      missSoundPlay();
    }
  };

  return { triggerTypingSound, triggerMissSound, clearTypeSoundPlay, typeSoundPlay, missSoundPlay };
};
