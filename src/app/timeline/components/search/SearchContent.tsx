import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import SearchCard from "./child/SearchModal";
import SearchInputs from "./child/SearchInputs";

interface SearchContentProps {
  refetch: () => void;
}

const SearchContent = ({ refetch }: SearchContentProps) => {
  return (
    <Flex as="section" width="100%" alignItems="center" mb={4}>
      <Box width="100%">
        <Box mb={3}>
          <SearchInputs refetch={refetch} />
        </Box>
        <Box>
          <SearchCard />
        </Box>
      </Box>
    </Flex>
  );
};

export default SearchContent;
