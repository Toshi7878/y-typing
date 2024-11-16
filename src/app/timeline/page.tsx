import { Box } from "@chakra-ui/react";
import Content from "./Content";
import TimelineProvider from "./TimelineProvider";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

export default async function Home() {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <TimelineProvider>
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
      </TimelineProvider>
    </SessionProvider>
  );
}
