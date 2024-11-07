import { FilterMode } from "@/app/timeline/ts/type";

export const searchTypeMode = (mode: FilterMode) => {
  if (mode === "roma") {
    return { romaType: { gt: 0 }, kanaType: { equals: 0 } };
  } else if (mode === "kana") {
    return { kanaType: { gt: 0 }, romaType: { equals: 0 } };
  } else if (mode === "romakana") {
    return { kanaType: { gt: 0 }, romaType: { gt: 0 } };
  }
};
