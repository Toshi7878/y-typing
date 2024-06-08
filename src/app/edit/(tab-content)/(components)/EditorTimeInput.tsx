import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { Input } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { timer } from "../../(youtube-content)/timer";
import { RootState } from "../../(redux)/store";
import { useSelector } from "react-redux";
import { usePlayer } from "../../(youtube-content)/playerProvider";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  time: z.string().min(1),
});

const EditorTimeInput = ({ onFormStateChange, timeRef }) => {
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
  const isPlaying = useSelector((state: RootState) => state.ytState.isPlaying);
  const { playerRef } = usePlayer();

  useEffect(() => {
    onFormStateChange(isValid);
  }, [isValid, onFormStateChange]);

  const updateTimeValue = useCallback(() => {
    setValue("time", timer.currentTime, { shouldValidate: true });
    if (timeRef) {
      timeRef.current = timer.currentTime;
    }
  }, [setValue, timeRef]);

  useEffect(() => {
    timer.addListener(updateTimeValue);

    return () => {
      timer.removeListener(updateTimeValue);
    };
  }, [updateTimeValue]);

  useEffect(() => {
    if (isPlaying && maxTime === "0") {
      const duration = playerRef.current?.getDuration().toFixed(3);
      if (duration !== undefined) {
        setMaxTime(duration);
      }
    }
  }, [maxTime, playerRef, isPlaying]);

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
};

export default EditorTimeInput;
