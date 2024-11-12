import { atom, useAtomValue, useSetAtom } from "jotai";
import { FilterMode, SearchResultKeyWords, SearchResultRange } from "../ts/type";
import { DEFAULT_CLEAR_RATE_SEARCH_RANGE, DEFAULT_KPM_SEARCH_RANGE } from "../ts/const/consts";
export const videoIdAtom = atom<string | null>(null);
export const previewTimeAtom = atom<string | null>(null);

const searchResultKeyWordsAtom = atom<SearchResultKeyWords>({
  mapKeyWord: "",
  userName: "",
});

export const useSearchResultKeyWordsAtom = () => {
  return useAtomValue(searchResultKeyWordsAtom);
};

export const useSetSearchResultKeyWordsAtom = () => {
  return useSetAtom(searchResultKeyWordsAtom);
};

const searchResultKpmAtom = atom<SearchResultRange>({
  minValue: DEFAULT_KPM_SEARCH_RANGE.min,
  maxValue: DEFAULT_KPM_SEARCH_RANGE.max,
});

export const useSearchResultKpmAtom = () => {
  return useAtomValue(searchResultKpmAtom);
};

export const useSetSearchResultKpmAtom = () => {
  return useSetAtom(searchResultKpmAtom);
};

const searchResultClearRateAtom = atom<SearchResultRange>({
  minValue: DEFAULT_CLEAR_RATE_SEARCH_RANGE.min,
  maxValue: DEFAULT_CLEAR_RATE_SEARCH_RANGE.max,
});

export const useSearchResultClearRateAtom = () => {
  return useAtomValue(searchResultClearRateAtom);
};

export const useSetSearchResultClearRateAtom = () => {
  return useSetAtom(searchResultClearRateAtom);
};

const searchResultSpeedRangeAtom = atom<SearchResultRange>({
  minValue: 1,
  maxValue: 2,
});

export const useSearchResultSpeedAtom = () => {
  return useAtomValue(searchResultSpeedRangeAtom);
};

export const useSetSearchResultSpeedAtom = () => {
  return useSetAtom(searchResultSpeedRangeAtom);
};

const searchResultModeAtom = atom<FilterMode>("all");

export const useSearchResultModeAtom = () => {
  return useAtomValue(searchResultModeAtom);
};

export const useSetSearchResultModeAtom = () => {
  return useSetAtom(searchResultModeAtom);
};
