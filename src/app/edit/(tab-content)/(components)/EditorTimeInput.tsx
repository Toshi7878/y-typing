import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { Input } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { timer } from "../../(youtube-content)/timer";
import { RootState } from "../../(redux)/store";
import { useSelector } from "react-redux";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRefs } from "../../(contexts)/refsProvider";

const schema = z.object({
  time: z.string().min(1),
});

interface EditorTimeInputProps {
  onFormStateChange: (isValid: boolean) => void;
}
const EditorTimeInput = forwardRef<unknown, EditorTimeInputProps>(function EditorTimeInput(
  { onFormStateChange },
  ref
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
  const isPlaying = useSelector((state: RootState) => state.ytState.isPlaying);
  const { playerRef } = useRefs();

  useEffect(() => {
    onFormStateChange(isValid);
  }, [isValid, onFormStateChange]);

  const updateTimeValue = useCallback(
    (currentTime: string) => {
      setValue("time", currentTime, { shouldValidate: true });
    },
    [setValue]
  );

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

  useImperativeHandle(ref, () => ({
    clearTime: () => {
      setValue("time", "", { shouldValidate: true });
    },
    getTime: () => methods.getValues("time"),
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