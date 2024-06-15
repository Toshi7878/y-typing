import { auth } from "@/lib/auth";
import Login from "./login/Login";
import NewMap from "./new-map/NewMap";

export default async function RightNav() {
  const session = await auth();

  return (
    <div className="flex items-center md:gap-10">
      {session?.user?.name ? <NewMap /> : <></>}
      <Login />
    </div>
  );
}
