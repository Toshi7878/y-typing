/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { timer } from "./(youtube-content)/timer";
import { useDispatch, useSelector } from "react-redux";
import { usePlayer } from "./(youtube-content)/playerProvider";
import { RootState } from "./(redux)/store";
import { useForm } from "react-hook-form";
import { setTimeIndex } from "./(redux)/lineIndexSlice";

const TimeRange = () => {
  console.log("range");

  const dispatch = useDispatch();
  const { register, setValue } = useForm();

  const { playerRef } = usePlayer();
  const isStarted = useSelector((state: RootState) => state.ytState.isStarted);
  const [isDisabled, setIsDisabled] = useState(true);
  const [rangeMaxValue, setRangeMaxValue] = useState("0");

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
    const updateRangeValue = () => {
      setValue("range", timer.currentTime);
    };

    timer.addListener(updateRangeValue);
    return () => {
      timer.removeListener(updateRangeValue);
    };
  }, []);

  return (
    <div>
      <input
        min="0"
        max={rangeMaxValue}
        step="0.1"
        id="time-range"
        type="range"
        {...register("range")}
        onChange={handleRangeChange}
        className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer dark:bg-gray-700"
        disabled={isDisabled}
      />
    </div>
  );
};

export default TimeRange;
