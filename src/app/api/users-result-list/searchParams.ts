import { DEFAULT_KPM_SEARCH_RANGE } from "@/app/timeline/ts/const/consts";
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
export const searchKpm = (min: number, max: number) => {
  if (max === 0) {
    return;
  }

  return {
    romaKpm: {
      ...{ gte: min },
      ...(max !== DEFAULT_KPM_SEARCH_RANGE.max && { lte: max }),
    },
  };
};

export const searchClearRate = (minRate: number, maxRate: number) => {};
