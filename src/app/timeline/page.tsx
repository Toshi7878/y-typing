import { Box } from "@chakra-ui/react";
import Content from "./Content";
import TimelineProvider from "./TimelineProvider";

export default async function Home() {
  return (
    <TimelineProvider>
      <Box
        as="main"
        minH="100vh"
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
        pt={16}
      >
        <Content />
      </Box>
    </TimelineProvider>
  );
}
