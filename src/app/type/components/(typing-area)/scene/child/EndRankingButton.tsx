"use client";
import { Button } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react"; // forwardRefを追加
import { useFormStatus } from "react-dom";

interface UploadButtonProps {
  responseStatus: number;
}

const EndUploadButton = ({ responseStatus }: UploadButtonProps) => {
  const { pending } = useFormStatus();
  const queryClient = useQueryClient(); // useQueryClientのインスタンスを作成

  const [isDisabled, setIsDisabled] = useState(false); // isDisabledの状態を追加

  useEffect(() => {
    if (responseStatus === 200) {
      setIsDisabled(true); // responseStatusが200のときボタンを無効化
      queryClient.invalidateQueries({ queryKey: ["userRanking"] });
    } else {
      setIsDisabled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseStatus]);

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

export default EndUploadButton;
