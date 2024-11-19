import { DEFAULT_VOLUME } from "@/config/consts";
import { atom, createStore, useAtomValue, useSetAtom } from "jotai";
const globalAtomStore = createStore();
export const getGlobalAtomStore = () => globalAtomStore;

const getInitialTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined") {
    const storedTheme = localStorage.getItem("chakra-ui-color-mode");
    // return storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";
  }
  return "dark";
};

export const themeAtom = atom<"light" | "dark">(getInitialTheme());

export const volumeAtom = atom<number>(DEFAULT_VOLUME);

export const useSetVolumeAtom = () => {
  return useSetAtom(volumeAtom, { store: globalAtomStore });
};

export const useVolumeAtom = () => {
  return useAtomValue(volumeAtom, { store: globalAtomStore });
};
