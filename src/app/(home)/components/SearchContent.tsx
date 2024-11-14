import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import SearchInputs from "./search/SearchInputs";

const SearchContent = () => {
  return (
    <Flex as="section" width="100%" alignItems="center" mb={4}>
      <Box width="100%">
        <Box mb={3}>
          <SearchInputs />
        </Box>
      </Box>
    </Flex>
  );
};

export default SearchContent;
