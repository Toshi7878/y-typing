import { useFormContext } from "react-hook-form";
import { Input } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { timer } from "../../(youtube-content)/timer";
import { RootState } from "../../(redux)/store";
import { useSelector } from "react-redux";
import { usePlayer } from "../../(youtube-content)/playerProvider";

const EditorTimeInput = () => {
  const { setValue, register, trigger } = useFormContext();
  const [maxTime, setMaxTime] = useState("0");
  const playing = useSelector((state: RootState) => state.playing.value);
  const { playerRef } = usePlayer();

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
    <Input
      placeholder="Time"
      size="sm"
      width="90px"
      type="number"
      {...register("time")}
      onChange={(e) => {
        if (Number(e.target.value) >= Number(maxTime))
          e.target.value = (Number(maxTime) - 0.001).toFixed(3);
        trigger("time");
      }}
    />
  );
};

export default EditorTimeInput;
