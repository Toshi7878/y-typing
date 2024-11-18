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

export default function VolumeRange() {
  const theme: ThemeColors = useTheme();
  // const [volume, setVolume] = useState(DEFAULT_VOLUME);

  // const handleChange = (value: number) => {
  //   setVolume(value);
  //   playerRef.current.setVolume(value);
  //   db.editorOption.put({ optionName: "volume-range", value });
  // };

  return (
    <HStack alignItems="center">
      <Text fontSize="lg" fontWeight="semibold" mr={2} color="#888">
        音量
      </Text>

      <Slider size="lg" w="200px" aria-label="slider-ex-1" max={100}>
        <SliderTrack>
          <SliderFilledTrack bg={theme.colors.type.progress.bg} />
        </SliderTrack>

        <SliderThumb />
      </Slider>
    </HStack>
  );
}
