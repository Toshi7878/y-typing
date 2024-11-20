import { ThemeColors } from "@/types";
import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const darkTheme: ThemeColors = {
  colors: {
    background: {
      body: "#212529",
      card: "#2b3035",
      header: "#375a7f",
    },
    button: {
      sub: {
        hover: "#FFFFFF60",
      },
    },
    border: {
      card: "#FFFFFF",
    },
    text: {
      body: "#FFFFFF",
      header: {
        normal: "#cccccc",
        hover: "#FFFFFF",
      },
    },
    primary: {
      main: "#3182CE",
      light: "#4ebafd",
      dark: "#00a3c4",
    },
    secondary: {
      main: "#00bd7e",
      light: "#3cd3bf",
    },
    error: {
      main: "#e53e3e",
      light: "#f57275",
    },

    semantic: {
      perfect: "#ffcc22",
      roma: "#00b5d8",
      kana: "#de781f",
      flick: "#59e04d",
      like: "#f472b6",
      clap: "#ffb825",
      word: {
        correct: "#3182ce",
        next: "#FFF",
        word: "#FFF",
        completed: "#4fd1c5",
      },
    },

    home: {
      card: {
        hover: "0 10px 15px -3px rgba(79, 209, 197, 0.3), 0 4px 6px -2px rgba(79, 209, 197, 0.2)",
      },
    },
  },
};

export const getTheme = (colorMode: "light" | "dark") => {
  // const themeColors = colorMode === "light" ? sodaTheme.colors : darkTheme.colors;
  const theme: ThemeColors = darkTheme;

  return extendTheme({
    config,
    colors: theme.colors,
    styles: {
      global: {
        "body, *": {
          transition: "background-color 0.5s ease",
        },
        body: {
          bg: theme.colors.background.body,
        },
      },
    },
  });
};
