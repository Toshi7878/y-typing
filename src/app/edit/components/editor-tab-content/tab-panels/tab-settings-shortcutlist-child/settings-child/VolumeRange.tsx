"use client";
import {
  FormLabel,
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useTheme,
} from "@chakra-ui/react";
import { useState } from "react";
import { db } from "@/lib/db";
import { useRefs } from "@/app/edit/edit-contexts/refsProvider";
import { DEFAULT_VOLUME } from "@/config/consts";
import { ThemeColors } from "@/types";

export default function VolumeRange() {
  const { playerRef } = useRefs();

  const theme: ThemeColors = useTheme();
  const [volume, setVolume] = useState(DEFAULT_VOLUME);

  const handleChange = (value: number) => {
    setVolume(value);
    playerRef.current.setVolume(value);
    db.editorOption.put({ optionName: "volume-range", value });
  };

  return (
    <HStack alignItems="center">
      <FormLabel fontSize="sm">音量</FormLabel>

      <Slider w="200px" aria-label="slider-ex-1" value={volume} max={100} onChange={handleChange}>
        <SliderTrack>
          <SliderFilledTrack bg={theme.colors.type.progress.bg} />
        </SliderTrack>

        <SliderThumb />
      </Slider>
    </HStack>
  );
}
