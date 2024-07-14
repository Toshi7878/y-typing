"use client";
import { Button } from "@chakra-ui/react";

import { useEffect, useState } from "react"; // useStateを追加
import { useFormStatus } from "react-dom";

interface EndButtonProps {
  pending?: boolean;
  isDisabled?: boolean;
}

const EndButton = (props: EndButtonProps) => {
  return (
    <Button
      className="cursor-pointer"
      variant="solid"
      py={12} // ボタンの縦幅を大きくする
      width="450px" // ボタンの幅を大きくする
      colorScheme="blue"
      border="1px"
      borderColor="black"
      isLoading={pending}
      isDisabled={isDisabled} // isDisabledを追加
      _hover={{ bg: "#3a90f3" }}
      type="submit"
      fontSize="3xl" // 文字サイズを大きくする
    >
      {isDisabled ? "ランキング登録完了" : "ランキング登録"}
    </Button>
  );
};

export default EndButton;
