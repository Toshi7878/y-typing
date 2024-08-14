"use client";
import { ThemeColors } from "@/types";
import { Button, useTheme } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react"; // forwardRefを追加
import { useFormStatus } from "react-dom";

interface UploadButtonProps {
  responseStatus: number;
}

const EndUploadButton = ({ responseStatus }: UploadButtonProps) => {
  const { pending } = useFormStatus();
  const queryClient = useQueryClient();
  const theme: ThemeColors = useTheme();

  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (responseStatus === 200) {
      setIsDisabled(true);
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
      py={12}
      width="450px"
      border="1px"
      borderColor="black"
      bg={theme.colors.type.progress.bg}
      color={theme.colors.type.card.color}
      isLoading={pending}
      isDisabled={isDisabled}
      type="submit"
      fontSize="3xl"
    >
      {isDisabled ? "ランキング登録完了" : "ランキング登録"}
    </Button>
  );
};

export default EndUploadButton;
