"use client";
import { Button } from "@chakra-ui/react";

import { useEffect } from "react";
import { useFormStatus } from "react-dom";
interface UploadButtonProps {
  responseStatus: number;
}
const UploadButton = ({ responseStatus }: UploadButtonProps) => {
  const { pending } = useFormStatus();

  useEffect(() => {
    if (responseStatus !== 200) {
    } else {
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
      isLoading={pending} // 変更
      // cursor={canUpload ? "" : "not-allowed"}
      // opacity={isUpButtonDisabled ? "0.6" : "1"}
      _hover={{ bg: "#3a90f3" }}
      type="submit"
    >
      ランキング登録
    </Button>
  );
};

export default UploadButton;
