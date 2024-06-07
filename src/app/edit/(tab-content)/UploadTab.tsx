import { useFormContext } from "react-hook-form";
import { Input, Box, Flex, Button } from "@chakra-ui/react";

const UploadTab = () => {
  const { register } = useFormContext();

  return (
    <form>
      <Box display="flex" flexDirection="column" gap="4">
        <Flex alignItems="center">
          <Input placeholder="制作者コメント" size="sm" {...register("UploadTab.creatorComment")} />
        </Flex>
        <Button
          variant="solid"
          size="sm"
          width="120px"
          height="35px"
          colorScheme="blue"
          border="1px"
          borderColor="black"
          _hover={{ bg: "#3a90f3" }}
          onClick={() => {}}
        >
          保存
        </Button>
      </Box>
    </form>
  );
};

export default UploadTab;
