import { FormProvider, useForm } from "react-hook-form";
import { Input } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState, useImperativeHandle, forwardRef } from "react";

import { useSelector } from "react-redux";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Line } from "@/types";
import { RootState } from "@/app/edit/redux/store";
import { useRefs } from "@/app/edit/edit-contexts/refsProvider";
import { timer } from "@/app/edit/ts/youtube-ts/editTimer";
import { useAtomValue } from "jotai";
import { isEditYouTubePlayingAtom } from "@/app/edit/edit-atom/editAtom";

const schema = z.object({
  time: z.string().min(1),
});

interface EditorTimeInputProps {
  onFormStateChange: (isValid: boolean) => void;
}
const EditorTimeInput = forwardRef<unknown, EditorTimeInputProps>(function EditorTimeInput(
  { onFormStateChange },
  ref,
) {
  const methods = useForm({
    mode: "all",
    resolver: zodResolver(schema),
    criteriaMode: "all",
  });
  const {
    register,
    setValue,
    formState: { isValid },
    trigger,
  } = methods;

  const [maxTime, setMaxTime] = useState("0");
  const setIsYTPlaying = useAtomValue(isEditYouTubePlayingAtom);

  const { playerRef } = useRefs();
  const mapData = useSelector((state: RootState) => state.mapData.value);
  const selectedIndex = useSelector((state: RootState) => state.lineIndex.selectedIndex);

  useEffect(() => {
    onFormStateChange(isValid);
  }, [isValid, onFormStateChange]);

  const updateTimeValue = useCallback(
    (currentTime: string) => {
      setValue("time", currentTime, { shouldValidate: true });
    },
    [setValue],
  );

  useEffect(() => {
    timer.addListener(updateTimeValue);

    return () => {
      timer.removeListener(updateTimeValue);
    };
  }, [updateTimeValue]);

  useEffect(() => {
    if (maxTime === "0") {
      if (setIsYTPlaying) {
        const duration = playerRef.current?.getDuration().toFixed(3);
        if (duration !== undefined) {
          setMaxTime(duration);
        }
      } else if (mapData.length >= 3) {
        setMaxTime(mapData[mapData.length - 1]["time"]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapData, maxTime, setIsYTPlaying]);

  useImperativeHandle(ref, () => ({
    clearTime: () => {
      setValue("time", "", { shouldValidate: true });
    },
    getTime: () => Number(methods.getValues("time")),
    selectedTime: () => {
      if (selectedIndex !== null) {
        const selectedTime = mapData[selectedIndex]?.["time"];
        setValue("time", selectedTime, { shouldValidate: true });
      }
    },
    undoAdd: (time: Line["time"]) => {
      setValue("time", time, { shouldValidate: true });
    },
  }));

  return (
    <FormProvider {...methods}>
      <Input
        placeholder="Time"
        size="sm"
        width="90px"
        type="number"
        {...register("time")}
        onChange={(e) => {
          if (Number(e.target.value) >= Number(maxTime)) {
            e.target.value = (Number(maxTime) - 0.001).toFixed(3);
          }
          trigger("time");
        }}
      />
    </FormProvider>
  );
});

export default EditorTimeInput;
