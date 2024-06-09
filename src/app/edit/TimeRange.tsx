/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { timer } from "./(youtube-content)/timer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./(redux)/store";
import { useForm } from "react-hook-form";
import { setTimeIndex } from "./(redux)/lineIndexSlice";
import "./(style)/editor.scss";
import { Box, HStack } from "@chakra-ui/react";
import { YTSpeedController } from "./(youtube-content)/ytHandleEvents";
import { useRefs } from "./(contexts)/refsProvider";
const TimeRange = () => {
  console.log("range");

  const dispatch = useDispatch();
  const { register, setValue } = useForm();

  const { playerRef } = useRefs();
  const isStarted = useSelector((state: RootState) => state.ytState.isStarted);
  const [isDisabled, setIsDisabled] = useState(true);
  const [rangeMaxValue, setRangeMaxValue] = useState("0");
  const speed = useSelector((state: RootState) => state.ytState.speed);

  const handleRangeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = Number(e.target.value);
      setValue("range", time.toFixed(3));
      if (playerRef.current) {
        playerRef.current.seekTo(time);
      }
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    },
    [dispatch, playerRef, setValue]
  );

  useEffect(() => {
    if (isStarted && isDisabled) {
      setIsDisabled(false);
      const duration = playerRef.current?.getDuration().toFixed(3);
      if (duration !== undefined) {
        setRangeMaxValue(duration);
        dispatch(setTimeIndex(0));
      }
    }
  }, [isStarted]);

  useEffect(() => {
    const updateRangeValue = (currentTime: string) => {
      setValue("range", currentTime);
    };

    timer.addListener(updateRangeValue);
    return () => {
      timer.removeListener(updateRangeValue);
    };
  }, []);

  return (
    <Box display="grid" gridTemplateColumns="1fr auto" gap="1rem">
      <input
        min="0"
        max={rangeMaxValue}
        step="0.1"
        id="time-range"
        type="range"
        {...register("range")}
        onChange={handleRangeChange}
        className="w-full bg-gray-200 rounded-lg cursor-pointer dark:bg-gray-700"
        disabled={isDisabled}
      />
      <HStack justify="center" className="w-[130px]">
        <Box>
          <button
            type="button"
            className="text-cyan-400 cursor-pointer"
            onClick={() => new YTSpeedController("down", { dispatch, playerRef })}
          >
            <div className="relative">
              -<small className="f-key">F9</small>
            </div>
          </button>
        </Box>
        <Box>
          <span id="speed">{speed.toFixed(2)}</span>倍速
        </Box>
        <Box>
          <button
            type="button"
            className="text-cyan-400 cursor-pointer"
            onClick={() => new YTSpeedController("up", { dispatch, playerRef })}
          >
            <div className="relative">
              +<small className="f-key">F10</small>
            </div>
          </button>
        </Box>
      </HStack>
    </Box>
  );
};

export default TimeRange;
