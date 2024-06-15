"use client";
import { Button } from "@chakra-ui/react";

import { RootState } from "../../(redux)/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setCanUpload } from "../../(redux)/buttonFlagsSlice";
interface UploadButtonProps {
  responseStatus: number;
}
const UploadButton = ({ responseStatus }: UploadButtonProps) => {
  const { genre, tags } = useSelector((state: RootState) => state.genreTag);
  const canUpload = useSelector((state: RootState) => state.btnFlags.canUpload);

  const isUpButtonDisabled = genre === "" || tags.length < 2 || !canUpload;
  const dispatch = useDispatch();

  useEffect(() => {
    if (responseStatus !== 200) {
    } else {
      dispatch(setCanUpload(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseStatus]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isUpButtonDisabled) {
      e.preventDefault();
    }
  };

  return (
    <Button
      className="cursor-pointer"
      variant="solid"
      size="lg"
      colorScheme="blue"
      width="200px"
      border="1px"
      borderColor="black"
      disabled={isUpButtonDisabled}
      opacity={isUpButtonDisabled ? "0.6" : "1"}
      _hover={{ bg: "#3a90f3" }}
      type="submit"
      onClick={handleClick}
    >
      保存
    </Button>
  );
};

export default UploadButton;
