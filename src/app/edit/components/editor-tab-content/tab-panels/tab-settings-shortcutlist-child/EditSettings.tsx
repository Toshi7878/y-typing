"use client";
import { HStack, VStack } from "@chakra-ui/react";
import LrcConvertButton from "./settings-child/LrcConvertButton";
import ConvertOptionButtons from "./settings-child/ConvertOptionButtons";
import VolumeRange from "./settings-child/VolumeRange";
import TotalTimeAdjust from "./settings-child/TotalTimeAdjust";

export default function EditSettings() {
  return (
    <VStack align="start" spacing={4}>
      <HStack spacing={10} alignItems="flex-end">
        <TotalTimeAdjust />
        <VolumeRange />
      </HStack>
      <HStack spacing={10} alignItems="flex-end">
        <ConvertOptionButtons />
        <LrcConvertButton />
      </HStack>
    </VStack>
  );
}
