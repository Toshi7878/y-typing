import { UploadResult } from "@/types";
import { useToast } from "@chakra-ui/react";

export const useSuccessToast = () => {
  const toast = useToast();

  return (state: UploadResult) => {
    const isSuccess = state.status === 200 ? true : false;
    if (isSuccess) {
      toast({
        title: state.title,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        containerStyle: {
          border: "1px solid",
          borderColor: "gray.200",
          fontSize: "lg",
        },
      });
    } else {
      toast({
        title: state.title,
        description: state.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
        containerStyle: {
          border: "1px solid",
          borderColor: "gray.200",
          fontSize: "lg", // サイズを大きくする
        },
      });
    }
  };
};
