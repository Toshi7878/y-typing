import { ThemeColors } from "@/types";
import { createSystem, defineConfig } from "@chakra-ui/react";
const darkTheme: ThemeColors = {
  background: {
    body: { value: "#212529" },
    card: { value: "#2b3035" },
    header: { value: "#375a7f" },
  },
  button: {
    sub: {
      hover: { value: "#FFFFFF60" },
    },
  },
  border: {
    card: { value: "#FFFFFF" },
    badge: { value: "#FFFFFF" },
  },
  text: {
    body: { value: "#FFFFFF" },
    header: {
      normal: { value: "#cccccc" },
      hover: { value: "#FFFFFF" },
    },
  },
  primary: {
    main: { value: "#3182CE" },
    light: { value: "#4ebafd" },
    dark: { value: "#00a3c4" },
  },
  secondary: {
    main: { value: "#00bd7e" },
    light: { value: "#3cd3bf" },
  },
  error: {
    main: { value: "#e53e3e" },
    light: { value: "#f57275" },
  },
  semantic: {
    perfect: { value: "#ffcc22" },
    roma: { value: "#00b5d8" },
    kana: { value: "#de781f" },
    flick: { value: "#59e04d" },
    like: { value: "#f472b6" },
    clap: { value: "#ffb825" },
    word: {
      correct: { value: "#3182ce" },
      next: { value: "#FFF" },
      word: { value: "#FFF" },
      completed: { value: "#4fd1c5" },
    },
  },
  home: {
    card: {
      hover: {
        value: "0 10px 15px -3px rgba(79, 209, 197, 0.3), 0 4px 6px -2px rgba(79, 209, 197, 0.2)",
      },
    },
  },
};

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        ...darkTheme,
      },
      fonts: {
        body: { value: "system-ui, sans-serif" },
      },
    },
  },
});

export const system = createSystem(config);
