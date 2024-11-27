import { useSetPreviewVideoIdAtom } from "@/components/atom/globalAtoms";
import { RESET } from "jotai/utils";

export const usePreviewYouTubeKeyDown = () => {
  const setPreviewVideoId = useSetPreviewVideoIdAtom();

  return (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setPreviewVideoId(RESET);
    }
  };
};
