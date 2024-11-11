import {
  Box,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Text,
} from "@chakra-ui/react";
import { Dispatch } from "react";

interface SearchRangeProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: { minValue: number; maxValue: number };
  setValue: Dispatch<{ minValue: number; maxValue: number }>;
}

const SearchRange = ({ label, min, max, step, value, setValue }: SearchRangeProps) => {
  return (
    <Box>
      <Text>{`${value.minValue} - ${value.maxValue === 1200 && label === "kpm" ? "All" : value.maxValue} ${label}`}</Text>
      <RangeSlider
        defaultValue={[value.minValue, value.maxValue]}
        min={min}
        max={max}
        step={step}
        onChange={(val) => {
          setValue({ minValue: val[0], maxValue: val[1] });
        }}
      >
        <RangeSliderTrack>
          <RangeSliderFilledTrack />
        </RangeSliderTrack>
        <RangeSliderThumb index={0} />
        <RangeSliderThumb index={1} />
      </RangeSlider>
    </Box>
  );
};

export default SearchRange;
