"use client";
import {
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useTheme,
  Text,
} from "@chakra-ui/react";

import { ThemeColors } from "@/types";
import { useSetVolumeAtom, useVolumeAtom } from "@/components/atom/globalAtoms";
import { db } from "@/lib/db";
import { IoMdVolumeMute } from "react-icons/io";
import { IoMdVolumeLow } from "react-icons/io";
import { IoMdVolumeHigh } from "react-icons/io";

interface VolumeRangeProps {
  playerRef: any;
}

export default function VolumeRange({ playerRef }: VolumeRangeProps) {
  const theme: ThemeColors = useTheme();
  const volumeAtom = useVolumeAtom();
  const setVolumeAtom = useSetVolumeAtom();
  const handleChange = (value: number) => {
    setVolumeAtom(value);
    if (playerRef.current) {
      playerRef.current.setVolume(value);
    }
    db.globalOption.put({ optionName: "volume-range", value });
  };
  return (
    <HStack alignItems="center">
      <Text fontSize="lg" fontWeight="semibold" mr={2}>
        音量
        {volumeAtom === 0 ? (
          <IoMdVolumeMute />
        ) : volumeAtom < 50 ? (
          <IoMdVolumeLow />
        ) : (
          <IoMdVolumeHigh />
        )}
      </Text>

      <Slider
        size="lg"
        w="200px"
        aria-label="slider-ex-1"
        onChange={handleChange}
        max={100}
        value={volumeAtom}
      >
        <SliderTrack>
          <SliderFilledTrack bg={theme.colors.type.progress.bg} />
        </SliderTrack>

        <SliderThumb />
      </Slider>
    </HStack>
  );
}
