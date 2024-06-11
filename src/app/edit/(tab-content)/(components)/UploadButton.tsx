import { Button } from "@chakra-ui/react";

import { RootState } from "../../(redux)/store";
import { useSelector } from "react-redux";

const UploadButton = () => {
  const isStarted = useSelector((state: RootState) => state.ytState.isStarted);

  // disabled={isUpButtonDisabled}
  // opacity={isUpButtonDisabled ? "0.6" : "1"}

  // const isUpButtonDisabled = genre === "" || tags.length < 2 || !isStarted;
  return (
    <Button
      className="cursor-pointer"
      variant="solid"
      size="lg"
      colorScheme="blue"
      width="200px"
      border="1px"
      borderColor="black"
      _hover={{ bg: "#3a90f3" }}
      type="submit"
    >
      保存
    </Button>
  );
};

export default UploadButton;
