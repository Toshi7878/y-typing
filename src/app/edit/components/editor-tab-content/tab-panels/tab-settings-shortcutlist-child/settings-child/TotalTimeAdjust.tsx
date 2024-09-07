"use client";
import { Button, FormLabel, Input, HStack, Box, useTheme, Tooltip } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { allAdjustTime } from "@/app/edit/redux/mapDataSlice";
import { RootState } from "@/app/edit/redux/store";
import { addHistory } from "@/app/edit/redux/undoredoSlice";
import { useSetCanUploadAtom } from "@/app/edit/edit-atom/editAtom";
import { ThemeColors } from "@/types";
import { useState } from "react";
import { useSuccessToast } from "@/lib/hooks/useSuccessToast";

export default function TotalTimeAdjust() {
  const dispatch = useDispatch();
  const setCanUpload = useSetCanUploadAtom();
  const theme: ThemeColors = useTheme();
  const successToast = useSuccessToast();

  const [totalAdjustValue, setTotalAdjustValue] = useState<string>("");

  const mapData = useSelector((state: RootState) => state.mapData.value);

  const allTimeAdjust = () => {
    if (!totalAdjustValue) {
      return;
    }

    const times = mapData.map((item) => item.time);
    setCanUpload(true);

    dispatch(
      addHistory({
        type: "allAdjustTime",
        data: { times, totalAdjustValue: Number(totalAdjustValue) },
      }),
    );
    dispatch(allAdjustTime(totalAdjustValue));
    const successState = {
      id: null,
      title: "タイムを調整しました",
      message: `全体のタイムが ${totalAdjustValue} 秒調整されました。\n
          Ctrl + Zで前のタイムに戻ることができます。`,
      status: 200,
    };
    successToast(successState);
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
        label={<Box>数値を入力後、実行ボタンを押すと、全体のタイムが数値分増減します</Box>}
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
            onChange={(e) => setTotalAdjustValue(e.target.value)}
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
