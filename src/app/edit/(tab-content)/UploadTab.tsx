import { useFormContext } from "react-hook-form";
import { Input, Box, Flex, Button, Stack, Badge } from "@chakra-ui/react";

const UploadTab = () => {
  const { register } = useFormContext();

  return (
    <form>
      <Box display="flex" flexDirection="column" gap="4">
        <Flex alignItems="center">
          <Input placeholder="制作者コメント" size="sm" {...register("UploadTab.creatorComment")} />
        </Flex>
        <Stack direction="row">
          <Badge variant="solid" colorScheme="green">
            東方ボーカル
          </Badge>
          <Badge variant="solid" colorScheme="red">
            ボーカロイド
          </Badge>
          <Badge variant="solid" colorScheme="red">
            アニメ
          </Badge>
          <Badge variant="solid" colorScheme="red">
            J-POP
          </Badge>
          <Badge variant="solid" colorScheme="purple">
            ゲーム
          </Badge>
          <Badge variant="solid" colorScheme="purple">
            Vtuber
          </Badge>
          <Badge variant="solid" colorScheme="purple">
            アニメ
          </Badge>
        </Stack>
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
