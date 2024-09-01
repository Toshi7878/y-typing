"use client";
import {
  Button,
  FormLabel,
  Input,
  HStack,
  useToast,
  Box,
  useTheme,
  Tooltip,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { allAdjustTime } from "@/app/edit/redux/mapDataSlice";
import { RootState } from "@/app/edit/redux/store";
import { addHistory } from "@/app/edit/redux/undoredoSlice";
import { useSetCanUploadAtom } from "@/app/edit/edit-atom/editAtom";
import { ThemeColors } from "@/types";
import { useState } from "react";

export default function TotalTimeAdjust() {
  const dispatch = useDispatch();
  const setCanUpload = useSetCanUploadAtom();
  const toast = useToast();
  const theme: ThemeColors = useTheme();
  const [totalAdjustValue, setTotalAdjustValue] = useState(0);

  const mapData = useSelector((state: RootState) => state.mapData.value);

  const allTimeAdjust = () => {
    if (!totalAdjustValue) {
      return;
    }

    const times = mapData.map((item) => item.time);
    setCanUpload(true);

    dispatch(addHistory({ type: "allAdjustTime", data: { times, totalAdjustValue } }));
    dispatch(allAdjustTime(totalAdjustValue));
    toast({
      title: "タイムを調整しました",
      description: (
        <Box as="small">
          全体のタイムが {totalAdjustValue} 秒調整されました。
          <br />
          Ctrl + Zで前のタイムに戻ることができます。
        </Box>
      ),
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
  };

  return (
    <HStack alignItems="baseline">
      <Tooltip
        bg={theme.colors.popup.bg}
        color={theme.colors.popup.color}
        borderWidth="1px"
        borderStyle="solid"
        borderColor={theme.colors.card.borderColor}
        css={{
          "--popper-arrow-bg": theme.colors.popup.bg,
          "--popper-arrow-shadow-color": theme.colors.card.borderColor,
        }}
        hasArrow
        placement="top"
        label={<Box>実行ボタンを押すと、全体のタイムが増減します</Box>}
      >
        <HStack alignItems="baseline">
          <FormLabel fontSize="sm">全体タイム調整</FormLabel>
          <Input
            placeholder=""
            type="number"
            size="md"
            step="0.05"
            min="-3"
            max="3"
            className="max-w-[70px]"
            bg={theme.colors.background}
            borderColor={`${theme.colors.card.borderColor}60`}
            value={totalAdjustValue}
            onChange={(e) => setTotalAdjustValue(Number(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                allTimeAdjust();
              }
            }}
          />

          <Button
            colorScheme="yellow"
            bg={theme.colors.background}
            variant={"outline"}
            onClick={allTimeAdjust}
          >
            実行
          </Button>
        </HStack>
      </Tooltip>
    </HStack>
  );
}
