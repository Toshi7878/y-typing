"use client";
import { VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "@/lib/db";
import { RootState } from "@/app/edit/redux/store";
import { useRefs } from "@/app/edit/edit-contexts/refsProvider";
import { EditSettingsRef } from "@/app/edit/ts/type";
import { IndexDBOption } from "@/types";
import LrcConvertButton from "./settings-child/LrcConvertButton";
import ConvertOptionButtons from "./settings-child/ConvertOptionButtons";
import VolumeRange from "./settings-child/VolumeRange";
import AddTimeAdjust from "./settings-child/AddTimeAdjust";
import { DEFAULT_ADJUST_TIME, DEFAULT_VOLUME } from "@/app/edit/ts/const/defaultValues";
import TotalTimeAdjust from "./settings-child/TotalTimeAdjust";

export default forwardRef<EditSettingsRef, unknown>(function EditSettings(props, ref) {
  const [optionsData, setOptionsData] = useState<IndexDBOption>();
  const [selectedConvertOption, setSelectedConvertOption] = useState("");
  const mapData = useSelector((state: RootState) => state.mapData!.value);
  const { setRef } = useRefs();

  useEffect(() => {
    db.editorOption.toArray().then((allData) => {
      const formattedData = allData.reduce((acc, { optionName, value }) => {
        acc[optionName] = value;
        return acc;
      }, {} as IndexDBOption);
      setOptionsData(formattedData);
      setSelectedConvertOption(formattedData["word-convert-option"] ?? "non_symbol");
      methods.reset({
        "time-offset": formattedData["time-offset"] ?? DEFAULT_ADJUST_TIME,
        "volume-range": formattedData["volume-range"] ?? DEFAULT_VOLUME,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ref && "current" in ref) {
      setRef("editSettingsRef", ref.current!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsData, mapData]);

  const methods = useForm();
  const { register, control, getValues } = methods;

  useImperativeHandle(ref, () => ({
    getTimeOffset: () => Number(methods.getValues("time-offset")),
    getWordConvertOption: () => selectedConvertOption,
    getVolume: () => Number(methods.getValues("volume-range")),
  }));

  const sendIndexedDB = async (target: HTMLInputElement) => {
    db.editorOption.put({ optionName: target.name, value: target.value });
  };

  return (
    <VStack align="start" spacing={4}>
      <AddTimeAdjust register={register} sendIndexedDB={sendIndexedDB} optionsData={optionsData} />
      <TotalTimeAdjust register={register} getValues={getValues} />
      <VolumeRange control={control} />
      <ConvertOptionButtons sendIndexedDB={sendIndexedDB} />
      <LrcConvertButton selectedConvertOption={selectedConvertOption} />
    </VStack>
  );
});
