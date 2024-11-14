import { DEFAULT_KPM_SEARCH_RANGE } from "@/app/timeline/ts/const/consts";
import { FilterMode } from "@/app/timeline/ts/type";
import { Prisma } from "@prisma/client";

export const searchTypeMode = (mode: FilterMode) => {
  if (mode === "roma") {
    return { romaType: { gt: 0 }, kanaType: { equals: 0 } };
  } else if (mode === "kana") {
    return { kanaType: { gt: 0 }, romaType: { equals: 0 } };
  } else if (mode === "romakana") {
    return { kanaType: { gt: 0 }, romaType: { gt: 0 } };
  }
};

export const searchMapKeyWord = (keyWord: string) => {
  if (keyWord) {
    return {
      OR: [
        {
          title: {
            contains: keyWord,
            mode: "insensitive",
          },
        },
        {
          artistName: {
            contains: keyWord,
            mode: "insensitive",
          },
        },
        {
          musicSource: {
            contains: keyWord,
            mode: "insensitive",
          },
        },
        {
          tags: {
            contains: keyWord,
            mode: "insensitive",
          },
        },
      ],
    };
  }
};

export const searchUserKeyWord = (nameKeyWord: string): Prisma.UserWhereInput | undefined => {
  if (nameKeyWord) {
    return {
      name: {
        contains: nameKeyWord,
        mode: "insensitive",
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

export const searchClearRate = (min: number, max: number) => {
  if (max === 0) {
    return;
  }

  return {
    clearRate: {
      ...{ gte: min },
      ...(max !== DEFAULT_KPM_SEARCH_RANGE.max && { lte: max }),
    },
  };
};

export const searchSpeed = (min: number, max: number) => {
  if (max === 0) {
    return;
  }

  return {
    defaultSpeed: {
      ...{ gte: min },
      ...(max !== DEFAULT_KPM_SEARCH_RANGE.max && { lte: max }),
    },
  };
};
