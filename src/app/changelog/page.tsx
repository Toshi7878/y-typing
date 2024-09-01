import { Box } from "@chakra-ui/react"; // Textを追加
import Content from "./content/Content";

export default function Home() {
  return (
    <Box
      as="main"
      minH="100vw"
      width={"100vw"}
      bg={"background"}
      display="flex"
      flexDirection="column"
      alignItems="baseline"
      pt={20}
      pl={"10%"}
    >
      <Content />
    </Box>
  );
}
