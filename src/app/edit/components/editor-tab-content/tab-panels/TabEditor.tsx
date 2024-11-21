import { Box, Card, CardBody, Flex, useTheme } from "@chakra-ui/react";
import { ThemeColors } from "@/types";

import EditorButtons from "./tab-editor-child/EditorButtons";
import EditorLineInput from "./tab-editor-child/EditorLineInput";
import EditorAddLyricsInput from "./tab-editor-child/EditorAddLyricsInput";
import AddTimeAdjust from "./tab-settings-shortcutlist-child/settings-child/AddTimeAdjust";

const TabEditor = () => {
  const theme: ThemeColors = useTheme();

  return (
    <Card variant="filled" bg={theme.colors.background.card} boxShadow="lg" color={"text.body"}>
      <CardBody py={4}>
        <Box display="flex" flexDirection="column" gap={1}>
          <EditorLineInput />

          <Flex justifyContent="space-between" alignItems="flex-end">
            <EditorButtons />
            <AddTimeAdjust />
          </Flex>

          <EditorAddLyricsInput />
        </Box>
      </CardBody>
    </Card>
  );
};

export default TabEditor;
