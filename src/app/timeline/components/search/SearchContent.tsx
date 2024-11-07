import { Box, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import SearchMode from "./child/SearchMode";
import { FilterMode } from "../../ts/type";
import { useRouter } from "next/navigation";

const SearchContent = () => {
  const [searchMode, setSearchMode] = useState<FilterMode>("all");
  const router = useRouter();

  useEffect(() => {
    router.push(`/timeline?mode=${searchMode}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchMode]);

  return (
    <Flex as="section" justifyContent="flex-end" width="100%" alignItems="center" mb={5}>
      <Box>
        <SearchMode setSearchMode={setSearchMode} />
      </Box>
    </Flex>
  );
};

export default SearchContent;
