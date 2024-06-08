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

const EditorTimeInput = ({ onFormStateChange }: any) => {
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
  const playing = useSelector((state: RootState) => state.playing.value);
  const { playerRef } = usePlayer();

  useEffect(() => {
    onFormStateChange(isValid);
  }, [isValid, onFormStateChange]);

  const updateTimeValue = useCallback(() => {
    setValue("time", timer.currentTime, { shouldValidate: true });
  }, [setValue]);

  useEffect(() => {
    timer.addListener(updateTimeValue);

    return () => {
      timer.removeListener(updateTimeValue);
    };
  }, [updateTimeValue]);

  useEffect(() => {
    if (playing && maxTime === "0") {
      const duration = playerRef.current?.getDuration().toFixed(3);
      if (duration !== undefined) {
        setMaxTime(duration);
      }
    }
  }, [maxTime, playerRef, playing]);

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
