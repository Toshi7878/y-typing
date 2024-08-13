import { ThemeColors } from "@/types";
import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

const sodaTheme: ThemeColors = {
  colors: {
    background: "#FFFFFF",
    color: "#000000",

    header: {
      bg: "white",
      color: "black",
      hover: {
        color: "black",
        bg: "#00000010",
      },
    },

    popup: {
      bg: "white",
      color: "black",
      hover: { bg: "gray.200" },
    },
    home: {
      card: {
        bg: "#CBD5E0",
        link: "#0f766e",
        hover: "0 10px 15px -3px rgba(20, 184, 166, 0.5), 0 4px 6px -2px rgba(20, 184, 166, 0.3)",
      },
    },
    type: {
      card: { bg: "#bee3f8", color: "black", borderColor: "#000", hover: { bg: "gray.200" } },
      word: {
        correct: "#1aa3ff",
        next: "#FFF",
        word: "#FFF",
        completed: "#50e3c2",
        error: "#e53e3e",
      },
      tab: {
        ranking: {
          myrank: {
            color: "green",
          },
        },
      },

      tooltip: {
        bg: "",
        color: "",
      },

      ready: {
        radio: {
          roma: {
            bg: "#00b5d8",
          },
          kana: {
            bg: "#de781f",
          },
          flick: {
            bg: "#59e04d",
          },
          hover: { color: "black" },
          selected: { color: "white" },
        },
      },

      progress: {
        bg: "#4d97e6",
      },
    },
  },
};

const darkTheme: ThemeColors = {
  colors: {
    background: "#212529",
    color: "#FFFFFF",

    popup: {
      bg: "#212529",
      color: "white",
      hover: {
        bg: "#f5f5f55b",
      },
    },
    header: {
      bg: "#375a7f",
      color: "#cccccc",
      hover: {
        color: "#FFFFFF",
        bg: "#00bd7e30",
      },
    },

    home: {
      card: {
        bg: "#2b3035",
        link: "#00bd7e",
        hover: "0 10px 15px -3px rgba(79, 209, 197, 0.3), 0 4px 6px -2px rgba(79, 209, 197, 0.2)",
      },
    },
    type: {
      card: { bg: "#2b3035", color: "#FFF", borderColor: "#FFF", hover: { bg: "#f5f5f55b" } },
      word: {
        correct: "#3182ce",
        next: "#FFF",
        word: "#FFF",
        completed: "#4fd1c5",
        error: "#e53e3e",
      },
      tab: {
        ranking: {
          myrank: {
            color: "#48BB78",
          },
        },
      },
      ready: {
        radio: {
          roma: {
            bg: "#00b5d8",
          },
          kana: {
            bg: "#de781f",
          },
          flick: {
            bg: "#59e04d",
          },
          hover: { color: "white" },
          selected: { color: "white" },
        },
      },
      progress: {
        bg: "#3182CE",
      },
    },
  },
};

export const getTheme = (colorMode: "light" | "dark") => {
  const themeColors = colorMode === "light" ? sodaTheme.colors : darkTheme.colors;
  return extendTheme({
    config,
    colors: themeColors,
    styles: {
      global: {
        "body, *": {
          transition: "background-color 0.5s ease",
        },
      },
    },
  });
};
