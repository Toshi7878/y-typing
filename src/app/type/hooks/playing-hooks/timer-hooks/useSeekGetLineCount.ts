import { CreateMap } from "@/app/type/ts/scene-ts/ready/createTypingWord";
import { useMapAtom } from "@/app/type/type-atoms/gameRenderAtoms";

export const useGetSeekLineCount = () => {
  const map = useMapAtom() as CreateMap;

  return (newTime: number): number => {
    const index = map.mapData.findIndex((line) => line.time >= newTime);
    return Math.max(index);
  };
};
