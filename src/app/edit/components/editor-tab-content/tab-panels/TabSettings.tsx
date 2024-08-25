import { ThemeColors } from "@/types";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Button,
  useTheme,
} from "@chakra-ui/react";

const TabSettings = (props: any) => {
  const theme: ThemeColors = useTheme();

  return (
    <Card bg={theme.colors.card.bg}>
      <CardHeader>
        <Heading size="md">設定</Heading>
      </CardHeader>

      <CardBody>
        <Text>ここに設定内容を記述します。</Text>
      </CardBody>

      <CardFooter>
        <Button colorScheme="blue">保存</Button>
      </CardFooter>
    </Card>
  );
};

export default TabSettings;
