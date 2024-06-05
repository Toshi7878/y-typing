/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { timer } from "./(youtube-content)/timer";
import { useDispatch, useSelector } from "react-redux";
import { startPlaying } from "./(redux)/playingSlice";
import { usePlayer } from "./(youtube-content)/playerProvider";
import { RootState } from "./(redux)/store";
import { useFormContext } from "react-hook-form";
import { setTimeIndex } from "./(redux)/lineIndexSlice";

const TimeRange = () => {
  console.log("range");

  const dispatch = useDispatch();
  const { register, setValue } = useFormContext();

  const { playerRef } = usePlayer();
  const playing = useSelector((state: RootState) => state.playing.value);

  const [isDisabled, setIsDisabled] = useState(true);
  const [rangeMaxValue, setRangeMaxValue] = useState("0");

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setValue("TimeRange.range", time.toFixed(3));
    if (playerRef.current) {
      playerRef.current.seekTo(time);
      dispatch(startPlaying()); // 再生を開始
    }
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  useEffect(() => {
    if (playing && isDisabled) {
      setIsDisabled(false);
      const duration = playerRef.current?.getDuration().toFixed(3);
      if (duration !== undefined) {
        setRangeMaxValue(duration);
        dispatch(setTimeIndex(0));
      }
    }
  }, [playerRef, playing, isDisabled]);

  return (
    <div>
      <input
        min="0"
        max={rangeMaxValue}
        step="0.1"
        id="time-range"
        type="range"
        {...register("TimeRange.range")}
        onChange={handleRangeChange}
        className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer dark:bg-gray-700"
        disabled={isDisabled}
      />
    </div>
  );
};

export default TimeRange;
