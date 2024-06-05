import { useFormContext } from "react-hook-form";
import { Input, Box } from "@chakra-ui/react";
import TabButton from "./(components)/TabButton";

const UploadTab = () => {
  const { register } = useFormContext();

  return (
    <form>
      <Box display="flex" flexDirection="column" gap="4">
        <Input
          placeholder="制作者コメント"
          size="sm"
          {...register("UploadTab.creatorComment")}
        />
      </Box>
      <TabButton
        colorScheme="teal"
        _hover={{ bg: "#6ee278ac" }}
        onClick={() => {}}
        text="保存"
      />
    </form>
  );
};

export default UploadTab;
