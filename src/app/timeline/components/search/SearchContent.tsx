import { Box, Flex, Stack } from "@chakra-ui/react";
import React from "react";
import SearchCard from "./child/SearchModal";
import SearchInputs from "./child/SearchInputs";

const SearchContent = () => {
  return (
    <Flex as="section" width="100%" alignItems="center" mb={4}>
      <Box width="100%">
        <Box mb={3}>
          <SearchInputs />
        </Box>
        <Box>
          <SearchCard />
        </Box>
      </Box>
    </Flex>
  );
};

export default SearchContent;
