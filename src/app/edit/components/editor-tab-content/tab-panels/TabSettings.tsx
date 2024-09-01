import { ThemeColors } from "@/types";
import { Card, CardBody, useTheme } from "@chakra-ui/react";
import EditorSettingModal from "./tab-settings-child/EditSettings";
import { EditSettingsRef } from "@/app/edit/ts/type";
import { useRef } from "react";

const TabSettings = (props: any) => {
  const theme: ThemeColors = useTheme();

  const editSettingsRef = useRef<EditSettingsRef>(null);

  return (
    <Card bg={theme.colors.card.bg}>
      <CardBody>
        <EditorSettingModal ref={editSettingsRef} />
      </CardBody>
    </Card>
  );
};

export default TabSettings;
