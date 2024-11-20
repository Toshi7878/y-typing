import { ThemeColors } from "@/types";
import { extendTheme, ThemeConfig, ThemeOverride } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
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
    card: { bg: "#bee3f8", color: "#000000", borderColor: "#000000", hover: { bg: "gray.200" } },

    popup: {
      bg: "white",
      color: "black",
      hover: { bg: "gray.200" },
    },
    home: {
      card: {
        bg: "#CBD5E0",
        link: "#0d9388",
        hover: "0 10px 15px -3px rgba(20, 184, 166, 0.5), 0 4px 6px -2px rgba(20, 184, 166, 0.3)",
      },
      badge: {
        info: {
          bg: "#414141",
          color: "#FFFFFF",
          borderColor: "#cccccc",
        },
      },
    },
    type: {
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
          perfect: {
            color: "#f6ff00",
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
          hover: { color: "black" },
          selected: { color: "white" },
        },
      },

      progress: {
        bg: "#4d97e6",
        hover: {
          bg: "#4ebafd",
        },
      },
    },
    edit: {
      mapTable: {
        currentTimeLine: {
          bg: "#3cd3bf",
        },
        selectedLine: {
          bg: "#3bd3ec",
          outlineColor: "#000000",
        },
        errorLine: {
          bg: "#f57275",
        },
      },
    },
  },
};

/* 未設定色
  Endメインボタン

 */
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
    card: { bg: "#2b3035", color: "#FFFFFF", borderColor: "#FFFFFF", hover: { bg: "#74777a" } },

    home: {
      card: {
        bg: "#2b3035",
        link: "#00bd7e",
        hover: "0 10px 15px -3px rgba(79, 209, 197, 0.3), 0 4px 6px -2px rgba(79, 209, 197, 0.2)",
      },
      badge: {
        info: {
          bg: "#2b3035",
          color: "#FFFFFF",
          borderColor: "#888888",
        },
      },
    },
    type: {
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
          perfect: {
            color: "#ffcc22",
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
        hover: {
          bg: "#4ebafd",
        },
      },
    },
    edit: {
      mapTable: {
        currentTimeLine: {
          bg: "#3cd3bf",
        },
        selectedLine: {
          bg: "#00a3c4",
          outlineColor: "#000000",
        },
        errorLine: {
          bg: "#f57275",
        },
      },
    },
  },
};

// ThemeOverrideを拡張する新しい型を定義

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
          bg: theme.colors.background,
        },
      },
    },
  });
};
