"use client";
import React, { useState, useEffect } from "react";
import { timer } from "./(youtube-content)/timer";
import { playerRefProps } from "./(youtube-content)/YoutubeConent";
import { useSelector } from "react-redux";

const TimeRange = ({
  className,
  playerRef,
  playing,
  setPlaying,
}: playerRefProps) => {
  const playingState: boolean = useSelector(
    (state: { playing: { value: boolean } }) => state.playing.value
  );
  const [isDisabled, setIsDisabled] = useState(true);
  const [rangeValue, setRangeValue] = useState(timer.currentTime);
  const [rangeMaxValue, setRangeMaxValue] = useState(0);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setRangeValue(newValue);
    if (playerRef.current) {
      playerRef.current.seekTo(newValue);
      setPlaying(true); // 再生を開始
    }
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  useEffect(() => {
    if (playing && isDisabled) {
      setIsDisabled(false);
      const duration = playerRef.current?.getDuration();
      if (duration !== undefined) {
        setRangeMaxValue(duration);
      }
    }
  }, [playerRef, playing, isDisabled]);

  useEffect(() => {
    const updateRangeValue = () => setRangeValue(timer.currentTime);
    timer.addListener(updateRangeValue);

    return () => {
      timer.removeListener(updateRangeValue);
    };
  }, []);

  return (
    <div className={className}>
      <input
        min="0"
        max={rangeMaxValue}
        step="0.1"
        id="time-range"
        type="range"
        value={rangeValue}
        onChange={handleRangeChange}
        className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer dark:bg-gray-700"
        disabled={isDisabled}
      />
    </div>
  );
};

export default TimeRange;
