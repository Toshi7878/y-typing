"use client";
import { Button, useTheme } from "@chakra-ui/react";

import { useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useCanUploadAtom, useSetCanUploadAtom } from "@/app/edit/edit-atom/editAtom";
import { useSuccessToast } from "@/lib/hooks/useSuccessToast";
import { useRouter, useSearchParams } from "next/navigation";
import { ThemeColors, UploadResult } from "@/types";
import { useInitializeEditorCreateBak } from "@/lib/db";
import { useUpdateNewMapBackUp } from "@/app/edit/hooks/useUpdateNewMapBackUp";
import { RootState } from "@/app/edit/redux/store";
import { useSelector } from "react-redux";
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
  const updateNewMapBackUp = useUpdateNewMapBackUp();
  const searchParams = useSearchParams();
  const newVideoId = searchParams.get("new") || "";
  const mapData = useSelector((state: RootState) => state.mapData.value);

  useEffect(() => {
    if (state.status !== 0) {
      successToast(state);

      const isSuccess = state.status === 200;

      if (isSuccess) {
        setCanUpload(false);
        if (state.id) {
          router.replace(`/edit/${state.id}`);
          initializeEditorCreateIndexedDB();
        }
      } else if (state.status === 500) {
        if (newVideoId) {
          updateNewMapBackUp(newVideoId, mapData);
          console.log(state.errorObject);
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (canUpload && !newVideoId) {
        event.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [canUpload, newVideoId]);

  return (
    <Button
      className="cursor-pointer"
      variant="solid"
      size="lg"
      width="200px"
      border="1px"
      isLoading={pending}
      bg={theme.colors.primary.main}
      color={"text.body"}
      _hover={{
        bg: canUpload ? theme.colors.primary.light : theme.colors.primary.main,
      }}
      borderColor={"border.card"}
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
