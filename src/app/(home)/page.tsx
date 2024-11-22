import Content from "./Content";
import HomeProvider from "./HomeProvider";

export default function Home() {
  return (
    <HomeProvider>
      <Content />
    </HomeProvider>
  );
}
