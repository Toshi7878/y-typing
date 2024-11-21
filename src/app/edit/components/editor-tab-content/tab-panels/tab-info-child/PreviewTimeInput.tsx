import { Box, FormLabel, HStack, Input, Text, useTheme } from "@chakra-ui/react";

import CustomToolTip from "@/components/custom-chakra-ui/CustomToolTip";
import { ThemeColors } from "@/types";
import {
  useEditPreviewTimeInputAtom,
  useSetCanUploadAtom,
  useSetEditPreviewTimeInputAtom,
} from "@/app/edit/edit-atom/editAtom";
import { FaPlay } from "react-icons/fa";
import { useRefs } from "@/app/edit/edit-contexts/refsProvider";

const PreviewTimeInput = () => {
  const theme: ThemeColors = useTheme();
  const { playerRef, editStatus } = useRefs();

  const previewTime = useEditPreviewTimeInputAtom();
  const setPreviewTime = useSetEditPreviewTimeInputAtom();
  const setCanUpload = useSetCanUploadAtom();

  const handlePreviewClick = () => {
    editStatus.current!.isNotAutoTabToggle = true;
    playerRef.current.seekTo(Number(previewTime));
  };

  return (
    <CustomToolTip
      tooltipLabel={
        <>
          <Box>
            譜面一覧でのプレビュー再生時に入力されているタイムから再生されるようになります。(サビのタイム推奨です)
          </Box>
          <Box>↑↓キー: 0.1秒ずつ調整, Enter:再生</Box>
        </>
      }
      placement="top"
    >
      <HStack alignItems="baseline">
        <FormLabel fontSize="sm">
          <HStack alignItems="baseline">
            <Text as="span" mr={3}>
              プレビュータイム
            </Text>

            <Input
              isInvalid={isNaN(Number(previewTime))}
              value={previewTime}
              width="80px"
              bg={"background.body"}
              type="number"
              size="sm"
              step="0.05"
              min="0"
              isRequired={true}
              onChange={(e) => {
                setPreviewTime(e.target.value);
                setCanUpload(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handlePreviewClick();
                }
              }}
            />
            <Box cursor="pointer" _hover={{ outline: "solid 1px" }} onClick={handlePreviewClick}>
              <FaPlay size={15} />
            </Box>
          </HStack>
        </FormLabel>
      </HStack>
    </CustomToolTip>
  );
};

export default PreviewTimeInput;
