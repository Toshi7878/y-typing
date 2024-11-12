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

export const searchMapKeyWord = (keyWord: string) => {};

export const searchUserKeyWord = (nameKeyWord: string) => {
  if (nameKeyWord) {
    return {
      name: {
        contains: nameKeyWord,
        // mode: "insensitive", // 大文字小文字を区別しない検索
      },
    };
  }
};
export const searchKpm = (minKpm: number, maxKpm: number) => {};

export const searchClearRate = (minRate: number, maxRate: number) => {};
