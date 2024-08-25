"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { timer } from "./ts/youtube-ts/editTimer";
import "@/app/edit/style/editor.scss";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { useRefs } from "./edit-contexts/refsProvider";
import { YTSpeedController } from "./ts/youtube-ts/editYtHandleEvents";
import { useAtom, useAtomValue } from "jotai";
import { editSpeedAtom, isEditYouTubeStartedAtom } from "./edit-atom/editAtom";
const TimeRange = () => {
  console.log("range");

  const { playerRef } = useRefs();
  const [isDisabled, setIsDisabled] = useState(true);
  const [rangeMaxValue, setRangeMaxValue] = useState("0");
  const rangeRef = useRef<HTMLInputElement>(null);
  const [speed, setSpeed] = useAtom(editSpeedAtom);

  const isYTStarted = useAtomValue(isEditYouTubeStartedAtom);

  const handleRangeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    rangeRef.current!.value = e.target.value;
    if (playerRef.current) {
      playerRef.current.seekTo(time);
    }
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isYTStarted) {
      setIsDisabled(false);
      const duration = playerRef.current?.getDuration().toFixed(3);
      if (duration !== undefined) {
        setRangeMaxValue(duration);
      }
    } else {
      setIsDisabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isYTStarted]);

  useEffect(() => {
    const updateRangeValue = (currentTime: string) => {
      rangeRef.current!.value = currentTime;
    };

    timer.addListener(updateRangeValue);
    return () => {
      timer.removeListener(updateRangeValue);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box display="grid" gridTemplateColumns="1fr auto" gap-y="1px">
      <input
        min="0"
        max={rangeMaxValue}
        step="0.1"
        id="time-range"
        type="range"
        ref={rangeRef}
        onChange={handleRangeChange}
        className="range-color w-full bg-gray-200 rounded-lg cursor-pointer dark:bg-gray-700"
        disabled={isDisabled}
      />
      <HStack justify="center" className="w-[170px]">
        <Box>
          <Button
            cursor="pointer"
            variant="unstyled"
            onClick={() =>
              new YTSpeedController("down", { setSpeed, playerRef: playerRef.current })
            }
          >
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
          <Button
            variant="unstyled"
            cursor="pointer"
            onClick={() => new YTSpeedController("up", { setSpeed, playerRef: playerRef.current })}
          >
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
