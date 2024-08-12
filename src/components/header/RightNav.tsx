import Login from "./login/Login";
import NewMap from "./new-map/NewMap";
import { useSession } from "next-auth/react";
import { Switch } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { themeAtom } from "./atom/atoms";

export default function RightNav() {
  const { data: session } = useSession();
  const [theme, setTheme] = useAtom(themeAtom);

  const changeTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setTheme("dark");
      localStorage.setItem("chakra-ui-color-mode", "dark");
    } else {
      setTheme("light");
      localStorage.setItem("chakra-ui-color-mode", "light");
    }
  };

  return (
    <div className="flex items-center gap-5 md:gap-10">
      {session?.user?.name ? <NewMap /> : <></>}
      <Switch onChange={changeTheme} isChecked={theme === "dark"} />
      <Login />
    </div>
  );
}
