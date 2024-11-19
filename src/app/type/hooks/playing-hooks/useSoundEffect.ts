import useSound from "use-sound";
import clearTypeSound from "@/asset/wav/clear_type.wav";
import typeSound from "@/asset/wav/key_type.wav";
import missSound from "@/asset/wav/miss_type.wav";
import { useVolumeAtom } from "@/components/atom/globalAtoms";

export const useSoundEffect = () => {
  const volume = useVolumeAtom();

  const [clearTypeSoundPlay] = useSound(clearTypeSound, { volume: volume / 100 });
  const [typeSoundPlay] = useSound(typeSound, { volume: volume / 100 });
  const [missSoundPlay] = useSound(missSound, { volume: volume / 100 });

  return { clearTypeSoundPlay, typeSoundPlay, missSoundPlay };
};
