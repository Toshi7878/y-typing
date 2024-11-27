import { useMapAtom, useTimeOffsetAtom, useUserOptionsAtom } from "../type-atoms/gameRenderAtoms";
import { useRefs } from "../type-contexts/refsProvider";

export const useGetCurrentLineTime = () => {
  const map = useMapAtom();
  const { playerRef, statusRef } = useRefs();
  const userOptionsAtom = useUserOptionsAtom();
  const timeOffset = useTimeOffsetAtom();

  return () => {
    const count = statusRef.current!.status.count;
    const prevLine = map!.mapData[count - 1];
    const currentTime =
      playerRef.current.getCurrentTime() - userOptionsAtom.timeOffset - timeOffset;
    const lineTime = currentTime - Number(prevLine.time);
    return lineTime;
  };
};
