"use client";
import { Button } from "@chakra-ui/react";

import { RootState } from "@/app/edit/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setCanUpload } from "@/app/edit/redux/buttonFlagsSlice";
import { useFormStatus } from "react-dom";
import { useTagsAtom } from "@/app/edit/edit-atom/editAtom";
interface UploadButtonProps {
  responseStatus: number;
}
const UploadButton = ({ responseStatus }: UploadButtonProps) => {
  const { pending } = useFormStatus();
  const tags = useTagsAtom();

  const canUpload = useSelector((state: RootState) => state.btnFlags!.canUpload);

  const isUpButtonDisabled = tags.length < 2 || !canUpload;
  const dispatch = useDispatch();

  useEffect(() => {
    if (responseStatus !== 200) {
    } else {
      dispatch(setCanUpload(false));
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
      cursor={canUpload ? "" : "not-allowed"}
      opacity={isUpButtonDisabled ? "0.6" : "1"}
      _hover={{ bg: "#3a90f3" }}
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
