"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { timer } from "../ts/youtube-ts/editTimer";
import "@/app/edit/style/editor.scss";
import { Box, Button, HStack, Text, useTheme } from "@chakra-ui/react";
import { useRefs } from "../edit-contexts/refsProvider";
import { ThemeColors } from "@/types";
import {
  useIsEditYTReadyAtom,
  useIsEditYTStartedAtom,
  useSpeedAtom,
  useSpeedReducer,
} from "../edit-atom/editAtom";
const TimeRange = () => {
  console.log("range");

  const { playerRef } = useRefs();
  const [rangeMaxValue, setRangeMaxValue] = useState("0");
  const rangeRef = useRef<HTMLInputElement>(null);
  const speed = useSpeedAtom(); //0.25 or 2.00 場合片方のボタンをdisabledにする
  const speedReducer = useSpeedReducer();
  const theme: ThemeColors = useTheme();

  const isYTStarted = useIsEditYTStartedAtom();
  const isYTReady = useIsEditYTReadyAtom();

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
    e.target.style.background = `linear-gradient(to right, ${theme.colors.type.progress.bg} ${progress}%, ${theme.colors.color}30 ${progress}%)`;

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
        rangeRef.current!.style.background = `linear-gradient(to right, ${theme.colors.type.progress.bg} ${progress}%, ${theme.colors.color}30 ${progress}%)`;
      }
    };

    timer.addListener(updateRangeValue);
    return () => {
      timer.removeListener(updateRangeValue);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeMaxValue, theme]);

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
      <HStack justify="center" className="w-[170px]">
        <Box>
          <Button cursor="pointer" variant="unstyled" onClick={() => speedReducer("down")}>
            <Box className="relative">
              -
              <Text as="span" className="f-key">
                F9
              </Text>
            </Box>
          </Button>
        </Box>
        <Box>
          <Text as="span" id="speed">
            {speed.toFixed(2)}
          </Text>
          倍速
        </Box>
        <Box>
          <Button variant="unstyled" cursor="pointer" onClick={() => speedReducer("up")}>
            <Box className="relative">
              +
              <Text as="span" className="f-key">
                F10
              </Text>
            </Box>
          </Button>
        </Box>
      </HStack>
    </Box>
  );
};

export default TimeRange;
