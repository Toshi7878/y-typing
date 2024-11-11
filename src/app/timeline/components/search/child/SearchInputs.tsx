import { SearchResultKeyWords } from "@/app/timeline/ts/type";
import { Button, HStack, Input } from "@chakra-ui/react";
import React, { useState } from "react";

const SearchInputs = () => {
  const [keyWords, setKeyWords] = useState<SearchResultKeyWords>({ mapKeyWord: "", userName: "" });
  return (
    <HStack>
      <Input
        size="md"
        placeholder="譜面キーワードで絞り込み"
        onChange={(e) => setKeyWords({ mapKeyWord: e.target.value, userName: keyWords.userName })}
      />
      <Input
        size="md"
        placeholder="ユーザーネームで絞り込み"
        onChange={(e) => setKeyWords({ mapKeyWord: keyWords.mapKeyWord, userName: e.target.value })}
      />
      <Button width="30%">検索</Button>
    </HStack>
  );
};

export default SearchInputs;
