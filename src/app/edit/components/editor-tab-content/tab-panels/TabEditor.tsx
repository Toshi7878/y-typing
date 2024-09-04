import { Box, Card, CardBody, Flex, useTheme } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { ThemeColors } from "@/types";

import { EditorButtonsRef } from "@/app/edit/ts/type";

import EditorButtons from "./tab-editor-child/EditorButtons";
import EditorLineInput from "./tab-editor-child/EditorLineInput";
import EditorAddLyricsInput from "./tab-editor-child/EditorAddLyricsInput";
import AddTimeAdjust from "./tab-settings-shortcutlist-child/settings-child/AddTimeAdjust";

const TabEditor = () => {
  const [isTimeInputValid, setIsTimeInputValid] = useState(false);
  const theme: ThemeColors = useTheme();

  const editorButtonsRef = useRef<EditorButtonsRef>(null);

  return (
    <Card variant="filled" bg={theme.colors.card.bg} boxShadow="lg" color={theme.colors.card.color}>
      <CardBody py={4}>
        <Box display="flex" flexDirection="column" gap={1}>
          <EditorLineInput setIsTimeInputValid={setIsTimeInputValid} />

          <Flex justifyContent="space-between" alignItems="flex-end">
            <EditorButtons ref={editorButtonsRef} isTimeInputValid={isTimeInputValid} />
            <AddTimeAdjust />
          </Flex>

          <EditorAddLyricsInput />
        </Box>
      </CardBody>
    </Card>
  );
};

export default TabEditor;
