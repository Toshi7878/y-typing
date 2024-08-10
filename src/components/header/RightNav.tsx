import { auth } from "@/lib/auth";
import Login from "./login/Login";
import NewMap from "./new-map/NewMap";
import { useSession } from "next-auth/react";

export default function RightNav() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-5 md:gap-10">
      {session?.user?.name ? <NewMap /> : <></>}
      <Login />
    </div>
  );
}
