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

interface VolumeRangeProps {
  playerRef: any;
}

export default function VolumeRange({ playerRef }: VolumeRangeProps) {
  const theme: ThemeColors = useTheme();
  const volumeAtom = useVolumeAtom();
  const setVolumeAtom = useSetVolumeAtom();
  const handleChange = (value: number) => {
    setVolumeAtom(value);
    playerRef.current.setVolume(value);
    db.globalOption.put({ optionName: "volume-range", value });
  };
  return (
    <HStack alignItems="center">
      <Text fontSize="lg" fontWeight="semibold" mr={2} color="#888">
        音量
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
