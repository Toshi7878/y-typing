import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const sodaTheme = {
  colors: {
    background: "white",
    color: "pink",
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
      card: { bg: "#bee3f8", color: "pink", borderColor: "#000", hover: { bg: "#f5f5f55b" } },

      tab: {
        ranking: {
          myrank: {
            color: "green",
          },
        },
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

const darkTheme = {
  colors: {
    background: "#212529",
    color: "white",

    menu: {
      bg: "white",
      color: "black",
    },
    header: {
      bg: "#375a7f",
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
  });
};
