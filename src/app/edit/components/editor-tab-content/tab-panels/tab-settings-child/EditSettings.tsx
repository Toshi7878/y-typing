"use client";
import { HStack, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { IndexDBOption } from "@/types";
import LrcConvertButton from "./settings-child/LrcConvertButton";
import ConvertOptionButtons from "./settings-child/ConvertOptionButtons";
import VolumeRange from "./settings-child/VolumeRange";
import AddTimeAdjust from "./settings-child/AddTimeAdjust";
import { DEFAULT_ADD_ADJUST_TIME } from "@/app/edit/ts/const/editDefaultValues";
import TotalTimeAdjust from "./settings-child/TotalTimeAdjust";
import {
  useEditWordConvertOptionAtom,
  useSetEditAddTimeOffsetAtom,
  useSetEditWordConvertOptionAtom,
} from "@/app/edit/edit-atom/editAtom";

export default function EditSettings() {
  const setSelectedConvertOption = useSetEditWordConvertOptionAtom();
  const selectedConvertOption = useEditWordConvertOptionAtom();
  const setAddTimeOffset = useSetEditAddTimeOffsetAtom();

  useEffect(() => {
    db.editorOption.toArray().then((allData) => {
      const formattedData = allData.reduce((acc, { optionName, value }) => {
        acc[optionName] = value;
        return acc;
      }, {} as IndexDBOption);
      setSelectedConvertOption(formattedData["word-convert-option"] ?? "non_symbol");
      setAddTimeOffset(formattedData["time-offset"] ?? DEFAULT_ADD_ADJUST_TIME);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendIndexedDB = async (target: HTMLInputElement) => {
    db.editorOption.put({ optionName: target.name, value: target.value });
  };

  return (
    <VStack align="start" spacing={4}>
      <HStack spacing={10}>
        <AddTimeAdjust sendIndexedDB={sendIndexedDB} />
        <VolumeRange />
      </HStack>
      <HStack spacing={10}>
        <TotalTimeAdjust />
        <LrcConvertButton selectedConvertOption={selectedConvertOption} />
      </HStack>
      <HStack spacing={10}>
        <ConvertOptionButtons
          sendIndexedDB={sendIndexedDB}
          selectedConvertOption={selectedConvertOption}
          setSelectedConvertOption={setSelectedConvertOption}
        />
      </HStack>
    </VStack>
  );
}
