import { atom } from "jotai";

const storedTheme = localStorage.getItem("theme");
const theme: "light" | "dark" =
  storedTheme === "light" || storedTheme === "dark" ? storedTheme : "light";

export const themeAtom = atom<"light" | "dark">(theme ? theme : "light");
