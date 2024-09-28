"use client";
import { Button, useTheme } from "@chakra-ui/react";

import { useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useCanUploadAtom, useSetCanUploadAtom } from "@/app/edit/edit-atom/editAtom";
import { useSuccessToast } from "@/lib/hooks/useSuccessToast";
import { useRouter } from "next/navigation";
import { ThemeColors, UploadResult } from "@/types";
import { useInitializeEditorCreateBak } from "@/lib/db";
interface UploadButtonProps {
  state: UploadResult;
}
const UploadButton = ({ state }: UploadButtonProps) => {
  const { pending } = useFormStatus();
  const theme: ThemeColors = useTheme();
  const canUpload = useCanUploadAtom();
  const setCanUpload = useSetCanUploadAtom();
  const successToast = useSuccessToast();
  const initializeEditorCreateIndexedDB = useInitializeEditorCreateBak();
  const router = useRouter();

  useEffect(() => {
    if (state.status !== 0) {
      successToast(state);

      const isSuccess = state.status === 200 ? true : false;

      if (isSuccess) {
        setCanUpload(false);
        if (state.id) {
          router.replace(`/edit/${state.id}`);
          initializeEditorCreateIndexedDB();
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Button
      className="cursor-pointer"
      variant="solid"
      size="lg"
      width="200px"
      border="1px"
      isLoading={pending}
      bg={theme.colors.type.progress.bg}
      color={theme.colors.card.color}
      _hover={{
        bg: canUpload ? theme.colors.type.progress.hover.bg : theme.colors.type.progress.bg,
      }}
      borderColor={theme.colors.card.borderColor}
      opacity={canUpload ? "1" : "0.7"}
      type="submit"
      onClick={(e) => {
        if (!canUpload) {
          e.preventDefault();
        }
      }}
    >
      保存
    </Button>
  );
};

export default UploadButton;
