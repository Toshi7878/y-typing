import { FormProvider, useForm } from "react-hook-form";
import { Input, useTheme } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState, useImperativeHandle, forwardRef } from "react";

import { useSelector } from "react-redux";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LineEdit, ThemeColors } from "@/types";
import { RootState } from "@/app/edit/redux/store";
import { useRefs } from "@/app/edit/edit-contexts/refsProvider";
import { timer } from "@/app/edit/ts/youtube-ts/editTimer";
import {
  useEditDirectEditCountAtom,
  useEditLineSelectedCountAtom,
  useIsEditYTPlayingAtom,
  useSetEditIsTimeInputValidAtom,
} from "@/app/edit/edit-atom/editAtom";
import { EditorTimeInputRef } from "@/app/edit/ts/type";

const schema = z.object({
  time: z.string().min(1),
});

const EditorTimeInput = forwardRef<EditorTimeInputRef, unknown>(
  function EditorTimeInput(props, ref) {
    const theme: ThemeColors = useTheme();
    const setEditIsTimeInputValid = useSetEditIsTimeInputValidAtom();
    const directEdit = useEditDirectEditCountAtom();

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
    const isYTPlaying = useIsEditYTPlayingAtom();
    const lineNumber = useEditLineSelectedCountAtom();
    const { playerRef, setRef } = useRefs();
    const mapData = useSelector((state: RootState) => state.mapData.value);

    useEffect(() => {
      if (ref && "current" in ref) {
        setRef("editorTimeInputRef", ref.current!);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapData, lineNumber, maxTime, isYTPlaying, directEdit]);

    useEffect(() => {
      setEditIsTimeInputValid(isValid);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isValid]);

    const updateTimeValue = useCallback(
      (currentTime: string) => {
        if (directEdit === null) {
          setValue("time", currentTime, { shouldValidate: true });
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [directEdit],
    );

    useEffect(() => {
      timer.addListener(updateTimeValue);

      return () => {
        timer.removeListener(updateTimeValue);
      };
    }, [updateTimeValue]);

    useEffect(() => {
      if (maxTime === "0") {
        if (isYTPlaying) {
          const duration = playerRef.current?.getDuration().toFixed(3);
          if (duration !== undefined) {
            setMaxTime(duration);
          }
        } else if (mapData.length >= 3) {
          setMaxTime(mapData[mapData.length - 1]["time"]);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapData, maxTime, isYTPlaying]);

    useImperativeHandle(ref, () => ({
      clearTime: () => {
        setValue("time", "", { shouldValidate: true });
      },
      getTime: () => Number(methods.getValues("time")),
      setSelectedTime: (count) => {
        if (count !== null) {
          const selectedTime = mapData[count]?.["time"];
          setValue("time", selectedTime, { shouldValidate: true });
        } else {
          setValue("time", "", { shouldValidate: true });
        }
      },
      setTime: (time: LineEdit["time"]) => {
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
          bg={theme.colors.background}
          borderColor={`${theme.colors.card.borderColor}60`}
          {...register("time")}
          onChange={(e) => {
            if (Number(e.target.value) >= Number(maxTime)) {
              e.target.value = (Number(maxTime) - 0.001).toFixed(3);
            }
            trigger("time");
          }}
          onKeyDown={(e) => {
            const value = e.currentTarget.value;

            if (e.code === "ArrowDown") {
              const newValue = (Number(value) - 0.1).toFixed(3);
              setValue("time", newValue, { shouldValidate: true });
              e.preventDefault();
            } else if (e.code === "ArrowUp") {
              const newValue = (Number(value) + 0.1).toFixed(3);
              setValue("time", newValue, { shouldValidate: true });
              e.preventDefault();
            }
          }}
        />
      </FormProvider>
    );
  },
);

export default EditorTimeInput;
