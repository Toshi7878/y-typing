"use client";
import {
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useTheme,
  Text,
  Flex,
  Box,
  SliderMark,
} from "@chakra-ui/react";

import { ThemeColors } from "@/types";
import { useSetVolumeAtom, useVolumeAtom } from "@/components/atom/globalAtoms";
import { db } from "@/lib/db";
import { IoMdVolumeMute } from "react-icons/io";
import { IoMdVolumeLow } from "react-icons/io";
import { IoMdVolumeHigh } from "react-icons/io";
import { useState } from "react";

interface VolumeRangeProps {
  playerRef: any;
}

export default function VolumeRange({ playerRef }: VolumeRangeProps) {
  const theme: ThemeColors = useTheme();
  const volumeAtom = useVolumeAtom();
  const setVolumeAtom = useSetVolumeAtom();
  const [showSliderMark, setShowSliderMark] = useState(false);

  const handleChange = (value: number) => {
    setVolumeAtom(value);
    if (playerRef.current) {
      playerRef.current.setVolume(value);
    }
    db.globalOption.put({ optionName: "volume-range", value });
  };
  return (
    <HStack alignItems="center">
      <Box>
        {volumeAtom === 0 ? (
          <IoMdVolumeMute size={24} />
        ) : volumeAtom < 50 ? (
          <IoMdVolumeLow size={24} />
        ) : (
          <IoMdVolumeHigh size={24} />
        )}
      </Box>

      <Slider
        size="lg"
        w="200px"
        aria-label="slider-ex-1"
        onChange={handleChange}
        max={100}
        value={volumeAtom}
        onMouseEnter={() => setShowSliderMark(true)}
        onMouseLeave={() => setShowSliderMark(false)}
      >
        {showSliderMark && (
          <SliderMark
            value={volumeAtom}
            textAlign="center"
            bg={theme.colors.popup.bg}
            color={theme.colors.popup.color}
            border="1px"
            borderColor={theme.colors.card.borderColor}
            mt="-10"
            ml="-4"
            w="8"
          >
            {volumeAtom}
          </SliderMark>
        )}
        <SliderTrack>
          <SliderFilledTrack bg={theme.colors.type.progress.bg} />
        </SliderTrack>

        <SliderThumb />
      </Slider>
    </HStack>
  );
}
