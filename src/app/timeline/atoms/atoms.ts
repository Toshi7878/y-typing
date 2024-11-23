import { atom, createStore, useAtomValue, useSetAtom } from "jotai";
import { FilterMode, SearchResultKeyWords, SearchResultRange } from "../ts/type";
import { DEFAULT_CLEAR_RATE_SEARCH_RANGE, DEFAULT_KPM_SEARCH_RANGE } from "../ts/const/consts";
const timelineAtomStore = createStore();
export const getTimelineAtomStore = () => timelineAtomStore;

export const searchResultKeyWordsAtom = atom<SearchResultKeyWords>({
  mapKeyWord: "",
  userName: "",
});

export const useSearchResultKeyWordsAtom = () => {
  return useAtomValue(searchResultKeyWordsAtom, { store: timelineAtomStore });
};

export const useSetSearchResultKeyWordsAtom = () => {
  return useSetAtom(searchResultKeyWordsAtom, { store: timelineAtomStore });
};

export const searchResultKpmAtom = atom<SearchResultRange>({
  minValue: DEFAULT_KPM_SEARCH_RANGE.min,
  maxValue: DEFAULT_KPM_SEARCH_RANGE.max,
});

export const useSearchResultKpmAtom = () => {
  return useAtomValue(searchResultKpmAtom, { store: timelineAtomStore });
};

export const useSetSearchResultKpmAtom = () => {
  return useSetAtom(searchResultKpmAtom, { store: timelineAtomStore });
};

const searchResultClearRateAtom = atom<SearchResultRange>({
  minValue: DEFAULT_CLEAR_RATE_SEARCH_RANGE.min,
  maxValue: DEFAULT_CLEAR_RATE_SEARCH_RANGE.max,
});

export const useSearchResultClearRateAtom = () => {
  return useAtomValue(searchResultClearRateAtom, { store: timelineAtomStore });
};

export const useSetSearchResultClearRateAtom = () => {
  return useSetAtom(searchResultClearRateAtom, { store: timelineAtomStore });
};

const searchResultSpeedRangeAtom = atom<SearchResultRange>({
  minValue: 1,
  maxValue: 2,
});

export const useSearchResultSpeedAtom = () => {
  return useAtomValue(searchResultSpeedRangeAtom, { store: timelineAtomStore });
};

export const useSetSearchResultSpeedAtom = () => {
  return useSetAtom(searchResultSpeedRangeAtom, { store: timelineAtomStore });
};

export const searchResultModeAtom = atom<FilterMode>("all");

export const useSearchResultModeAtom = () => {
  return useAtomValue(searchResultModeAtom, { store: timelineAtomStore });
};

export const useSetSearchResultModeAtom = () => {
  return useSetAtom(searchResultModeAtom, { store: timelineAtomStore });
};
