import { atom, createStore, useAtomValue, useSetAtom } from "jotai";

const homeAtomStore = createStore();
export const getHomeAtomStore = () => homeAtomStore;

export const searchMapKeyWordsAtom = atom<string>("");

export const useSearchMapKeyWordsAtom = () => {
  return useAtomValue(searchMapKeyWordsAtom, { store: homeAtomStore });
};

export const useSetSearchMapKeyWordsAtom = () => {
  return useSetAtom(searchMapKeyWordsAtom, { store: homeAtomStore });
};
