import Login from "./login/Login";
import NewMap from "./new-map/NewMap";

export default function RightNav() {
  return (
    <div className="flex items-center md:gap-10">
      <NewMap />
      <Login />
    </div>
  );
}
