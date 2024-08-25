"use client";
import React, { useState, useEffect, useCallback } from "react";
import { timer } from "./ts/youtube-ts/editTimer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useForm } from "react-hook-form";
import { setTimeIndex } from "@/app/edit/redux/lineIndexSlice";
import "@/app/edit/style/editor.scss";
import { Box, Button, HStack, Input, Text } from "@chakra-ui/react";
import { useRefs } from "./edit-contexts/refsProvider";
import { YTSpeedController } from "./ts/youtube-ts/editYtHandleEvents";
import { useAtom } from "jotai";
import { editSpeedAtom } from "./edit-atom/editAtom";
const TimeRange = () => {
  console.log("range");

  const dispatch = useDispatch();
  const { register, setValue } = useForm();

  const { playerRef } = useRefs();
  const isStarted = useSelector((state: RootState) => state.ytState.isStarted);
  const [isDisabled, setIsDisabled] = useState(true);
  const [rangeMaxValue, setRangeMaxValue] = useState("0");
  const [speed, setSpeed] = useAtom(editSpeedAtom);

  const handleRangeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setValue("range", time.toFixed(3));
    if (playerRef.current) {
      playerRef.current.seekTo(time);
    }
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isStarted) {
      setIsDisabled(false);
      const duration = playerRef.current?.getDuration().toFixed(3);
      if (duration !== undefined) {
        setRangeMaxValue(duration);
        dispatch(setTimeIndex(0));
      }
    } else {
      setIsDisabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStarted]);

  useEffect(() => {
    const updateRangeValue = (currentTime: string) => {
      setValue("range", currentTime);
    };

    timer.addListener(updateRangeValue);
    return () => {
      timer.removeListener(updateRangeValue);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box display="grid" gridTemplateColumns="1fr auto" gap="1rem">
      <Input
        min="0"
        variant="unstyled"
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
          <Button
            type="button"
            className="text-cyan-400 cursor-pointer"
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
            type="button"
            variant="unstyled"
            className="text-cyan-400 cursor-pointer"
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
