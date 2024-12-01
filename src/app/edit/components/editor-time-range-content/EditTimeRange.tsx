"use client";
import "@/app/edit/style/editor.scss";
import { ThemeColors } from "@/types";
import { Box, useTheme } from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useIsEditYTReadyAtom, useIsEditYTStartedAtom } from "../../edit-atom/editAtom";
import { useRefs } from "../../edit-contexts/refsProvider";
import { editTimer } from "../../ts/youtube-ts/editTimer";
import EditSpeedChange from "./child/EditSpeedChange";
const TimeRange = () => {
  const { playerRef, setRef } = useRefs();

  const [rangeMaxValue, setRangeMaxValue] = useState("0");
  const rangeRef = useRef<HTMLInputElement>(null);
  const theme: ThemeColors = useTheme();

  const isYTStarted = useIsEditYTStartedAtom();
  const isYTReady = useIsEditYTReadyAtom();

  useEffect(() => {
    setRef("rangeRef", rangeRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRangeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    rangeRef.current!.value = e.target.value;
    playerRef.current.playVideo();

    if (playerRef.current) {
      playerRef.current.seekTo(time);
    }
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    const progress = (time / Number(e.target.max)) * 100;
    e.target.style.background = `linear-gradient(to right, ${theme.colors.primary.main} ${progress}%, ${theme.colors.text.body}30 ${progress}%)`;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isYTStarted) {
      const duration = playerRef.current?.getDuration().toFixed(3);
      if (duration !== undefined) {
        setRangeMaxValue(duration);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isYTStarted]);

  useEffect(() => {
    if (isYTReady) {
      const duration = playerRef.current?.getDuration().toFixed(3);
      if (duration !== undefined) {
        setRangeMaxValue(duration);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isYTReady]);

  useEffect(() => {
    const updateRangeValue = (currentTime: string) => {
      const currentRangeRef = rangeRef.current;
      if (currentRangeRef) {
        rangeRef.current!.value = currentTime;
        const progress = (Number(currentTime) / Number(rangeMaxValue)) * 100;
        rangeRef.current!.style.background = `linear-gradient(to right, ${theme.colors.primary.main} ${progress}%, ${theme.colors.text.body}30 ${progress}%)`;
      }
    };

    editTimer.addListener(updateRangeValue);
    return () => {
      editTimer.removeListener(updateRangeValue);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeMaxValue]);

  return (
    <Box display="grid" gridTemplateColumns="1fr auto" gap-y="1px" alignItems="center">
      <input
        min="0"
        max={rangeMaxValue}
        step="0.1"
        id="time-range"
        type="range"
        ref={rangeRef}
        onChange={handleRangeChange}
        className="w-full cursor-pointer"
      />
      <EditSpeedChange />
    </Box>
  );
};

export default TimeRange;
