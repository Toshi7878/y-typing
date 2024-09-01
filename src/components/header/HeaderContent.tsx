import LeftNav from "./child/LeftNav";
import RightNav from "./child/RightNav";
import { Box } from "@chakra-ui/react";

const HeaderContent = () => {
  return (
    <Box as="header" id="header" className="fixed w-full z-40" bg={"header.bg"} width="100vw">
      <Box className="container md:max-w-[80rem] h-1 py-5 flex items-center justify-between">
        <LeftNav />
        <RightNav />
      </Box>
    </Box>
  );
};

export default HeaderContent;
