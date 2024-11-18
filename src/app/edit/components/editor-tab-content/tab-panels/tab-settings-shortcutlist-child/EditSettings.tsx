"use client";
import { HStack, VStack } from "@chakra-ui/react";
import LrcConvertButton from "./settings-child/LrcConvertButton";
import ConvertOptionButtons from "./settings-child/ConvertOptionButtons";
import VolumeRange from "./settings-child/VolumeRange";
import TotalTimeAdjust from "./settings-child/TotalTimeAdjust";

export default function EditSettings() {
  const isIOS = typeof navigator !== "undefined" && /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);

  return (
    <VStack align="start" spacing={4}>
      <HStack spacing={10} alignItems="flex-end">
        <TotalTimeAdjust />
        {!isIOS && !isAndroid && <VolumeRange />}
      </HStack>
      <HStack spacing={10} alignItems="flex-end">
        <ConvertOptionButtons />
        <LrcConvertButton />
      </HStack>
    </VStack>
  );
}
