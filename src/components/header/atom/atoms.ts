import { atom } from "jotai";

const getInitialTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined") {
    const storedTheme = localStorage.getItem("chakra-ui-color-mode");
    return storedTheme === "light" || storedTheme === "dark" ? storedTheme : "light";
  }
  return "light";
};

export const themeAtom = atom<"light" | "dark">(getInitialTheme());
