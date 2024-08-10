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

    home: {
      card: {
        bg: "#CBD5E0",
        link: "#0f766e",
        hover: "0 10px 15px -3px rgba(20, 184, 166, 0.5), 0 4px 6px -2px rgba(20, 184, 166, 0.3)",
      },
    },
    type: {
      card: { bg: "#bee3f8", color: "pink" },

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
    background: "#1A202C",
    color: "#E2E8F0",
    header: {
      bg: "#2D3748",
    },
    home: {
      card: {
        bg: "#4A5568",
        link: "#4FD1C5",
        hover: "0 10px 15px -3px rgba(79, 209, 197, 0.3), 0 4px 6px -2px rgba(79, 209, 197, 0.2)",
      },
    },
    type: {
      card: { bg: "#2C5282", color: "#E2E8F0" },
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
