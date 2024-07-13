"use client";
import { Button } from "@chakra-ui/react";

import { useEffect, useState } from "react"; // useStateを追加
import { useFormStatus } from "react-dom";

interface UploadButtonProps {
  responseStatus: number;
}

const UploadButton = ({ responseStatus }: UploadButtonProps) => {
  const { pending } = useFormStatus();

  const [isDisabled, setIsDisabled] = useState(false); // isDisabledの状態を追加

  useEffect(() => {
    if (responseStatus === 200) {
      setIsDisabled(true); // responseStatusが200のときボタンを無効化
    } else {
      setIsDisabled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseStatus]);

  return (
    <Button
      className="cursor-pointer"
      variant="solid"
      size="lg"
      colorScheme="blue"
      width="200px"
      border="1px"
      borderColor="black"
      isLoading={pending}
      isDisabled={isDisabled} // isDisabledを追加
      _hover={{ bg: "#3a90f3" }}
      type="submit"
    >
      ランキング登録
    </Button>
  );
};

export default UploadButton;
