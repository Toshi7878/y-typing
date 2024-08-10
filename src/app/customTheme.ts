import { extendTheme } from "@chakra-ui/react";

const defaultTheme = {
  colors: {
    background: "white",
    color: "pink",
    header: {
      bg: "white",
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
        borderRadius: "5px",
      },
    },
  },
};

export const theme = extendTheme(defaultTheme);
