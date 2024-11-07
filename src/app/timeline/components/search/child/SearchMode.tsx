import { FilterMode } from "@/app/timeline/ts/type";
import { Select } from "@chakra-ui/react";
import { SetStateAction } from "jotai";
import React, { Dispatch } from "react";

interface SearchModeProps {
  setSearchMode: Dispatch<SetStateAction<FilterMode>>;
}
const SearchMode = ({ setSearchMode }: SearchModeProps) => {
  const changeSearchMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchMode(e.target.value as FilterMode);
  };

  return (
    <Select size="sm" defaultValue="all" onChange={changeSearchMode}>
      <option value="all">全ての入力モード</option>
      <option value="roma">ローマ字</option>
      <option value="kana">かな入力</option>
      <option value="romakana">ローマ字+かな入力</option>
    </Select>
  );
};

export default SearchMode;
