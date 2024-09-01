import { ThemeColors } from "@/types";
import { Card, CardBody, useTheme } from "@chakra-ui/react";
import EditorSettingModal from "./tab-settings-child/EditSettings";

const TabSettings = () => {
  const theme: ThemeColors = useTheme();

  return (
    <Card bg={theme.colors.card.bg}>
      <CardBody>
        <EditorSettingModal />
      </CardBody>
    </Card>
  );
};

export default TabSettings;
