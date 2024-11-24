import Content from "./Content";
import HomeProvider from "./HomeClientProvider";

export default function Home() {
  return (
    <HomeProvider>
      <Content />
    </HomeProvider>
  );
}
