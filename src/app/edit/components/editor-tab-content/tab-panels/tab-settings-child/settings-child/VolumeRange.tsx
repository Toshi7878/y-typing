"use client";
import {
  FormLabel,
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import { Control, Controller, FieldValues } from "react-hook-form";
import { db } from "@/lib/db";
import { useRefs } from "@/app/edit/edit-contexts/refsProvider";

interface VolumeRangeProps {
  control: Control<FieldValues>;
}

export default function VolumeRange(props: VolumeRangeProps) {
  const { playerRef } = useRefs();
  const DEFAULT_VOLUME = 50;

  return (
    <HStack alignItems="center">
      <FormLabel fontSize="sm">音量</FormLabel>

      <Controller
        name="volume-range"
        control={props.control}
        defaultValue={DEFAULT_VOLUME}
        render={({ field }) => (
          <Slider
            w="200px"
            aria-label="slider-ex-1"
            {...field}
            onChange={(value) => {
              field.onChange(value);
              playerRef.current.setVolume(value);
              db.editorOption.put({ optionName: "volume-range", value });
            }}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        )}
      />
    </HStack>
  );
}
