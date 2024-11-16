"use client";

import Login from "./right-child/login/Login";
import NewMap from "./right-child/new-map/NewMap";
import { useSession } from "next-auth/react";
import { Box, Switch } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { themeAtom } from "../../atom/globalAtoms";
import { LikeButton } from "@/components/like-button/LikeButton";

export default function RightNav() {
  const { data: session } = useSession();
  const [themeColor, setThemeColor] = useAtom(themeAtom);

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
    <Box className="flex items-center gap-5 ">
      {session?.user?.name ? <NewMap /> : null}
      <Switch onChange={changeTheme} isChecked={themeColor === "dark"} />
      <Login />
      <LikeButton size={50} />
    </Box>
  );
}
