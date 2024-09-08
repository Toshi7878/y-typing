"use client";

import Login from "./right-child/login/Login";
import NewMap from "./right-child/new-map/NewMap";
import { useSession } from "next-auth/react";
import { Box, Switch, useTheme } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { themeAtom } from "../../atom/globalAtoms";
import { FaPalette } from "react-icons/fa";
import { ThemeColors } from "@/types";

export default function RightNav() {
  const { data: session } = useSession();
  const [themeColor, setThemeColor] = useAtom(themeAtom);
  const theme: ThemeColors = useTheme();

  const changeTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setThemeColor("dark");
      localStorage.setItem("chakra-ui-color-mode", "dark");
    } else {
      setThemeColor("light");
      localStorage.setItem("chakra-ui-color-mode", "light");
    }
  };

  return (
    <Box className="flex items-center gap-5 md:gap-10">
      {session?.user?.name ? <NewMap /> : <></>}

      <Switch onChange={changeTheme} isChecked={themeColor === "dark"} />

      <Box
        className="cursor-pointer text-xl"
        color={theme.colors.header.color}
        _hover={{
          color: theme.colors.header.hover.color,
        }}
      >
        {/* <FaPalette /> */}
      </Box>

      <Login />
    </Box>
  );
}
