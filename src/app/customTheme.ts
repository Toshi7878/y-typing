import { ThemeColors } from "@/types";
import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const sodaTheme: ThemeColors = {
  colors: {
    background: "white",
    color: "black",
    header: {
      bg: "white",
    },

    menu: {
      bg: "white",
      color: "black",
    },
    home: {
      card: {
        bg: "#CBD5E0",
        link: "#0f766e",
        hover: "0 10px 15px -3px rgba(20, 184, 166, 0.5), 0 4px 6px -2px rgba(20, 184, 166, 0.3)",
      },
    },
    type: {
      card: { bg: "#bee3f8", color: "black", borderColor: "#000", hover: { bg: "#f5f5f55b" } },
      word: {
        correct: "#1aa3ff",
        next: "#FFF",
        word: "#FFF",
        completed: "#50e3c2",
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
          hover: { bg: "#4FD1C5", color: "black" },
          selected: { bg: "#2C7A7B", color: "white" },
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
    color: "white",

    menu: {
      bg: "white",
      color: "black",
    },
    header: {
      bg: "#212529",
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
          hover: { bg: "#319795", color: "white" },
          selected: { bg: "#2C7A7B", color: "white" },
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
