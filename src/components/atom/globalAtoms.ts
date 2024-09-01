import { DEFAULT_VOLUME } from "@/config/consts";
import { atom, useAtomValue, useSetAtom } from "jotai";

const getInitialTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined") {
    const storedTheme = localStorage.getItem("chakra-ui-color-mode");
    return storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";
  }
  return "dark";
};

export const themeAtom = atom<"light" | "dark">(getInitialTheme());

const volumeAtom = atom<number>(DEFAULT_VOLUME);

export const useVolumeAtom = () => {
  return useAtomValue(volumeAtom);
};
export const useSetVolumeAtom = () => {
  return useSetAtom(volumeAtom);
};
