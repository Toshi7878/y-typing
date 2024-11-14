import { Box } from "@chakra-ui/react";
import Content from "./Content";
import HomeProvider from "./HomeProvider";

export default function Home() {
  return (
    <HomeProvider>
      <Box
        as="main"
        minH="100vh" // 変更: 100vw から 100vh へ
        width={"100%"}
        bg={"background"}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
        pt={20}
      >
        <Content />
      </Box>
    </HomeProvider>
  );
}
