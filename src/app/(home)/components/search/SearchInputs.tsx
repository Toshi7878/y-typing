import { Button, HStack, Input } from "@chakra-ui/react";
import React from "react";
import { useSearchMapKeyWordsAtom, useSetSearchMapKeyWordsAtom } from "../../atoms/atoms";
import { useSearchReload } from "../../hooks/useSearchReload";

const SearchInputs = () => {
  const searchMapKeywords = useSearchMapKeyWordsAtom();
  const setSearchKeywords = useSetSearchMapKeyWordsAtom();
  const searchReload = useSearchReload();
  return (
    <HStack>
      <Input
        size="md"
        value={searchMapKeywords}
        placeholder="検索"
        onChange={(e) => setSearchKeywords(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            searchReload();
          }
        }}
      />

      <Button width="30%" onClick={searchReload}>
        検索
      </Button>
    </HStack>
  );
};

export default SearchInputs;
