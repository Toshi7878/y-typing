import { Image } from "@chakra-ui/next-js";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import ThumbnailPreviewCover from "./child/ThumbnailPreviewCover";
import SkeletonThumbnail from "./SkeletonThumbnail";

interface MapLeftThumbnailProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  mapVideoId: string;
  mapPreviewTime: string;
  thumbnailQuality: "maxresdefault" | "mqdefault";
  thumnailWidth: Partial<Record<string, number>>;
  thumnailHeight: Partial<Record<string, number>>;
}
const MapLeftThumbnail = (props: MapLeftThumbnailProps) => {
  const { src, fallbackSrc, alt, mapVideoId, mapPreviewTime, thumnailWidth, thumnailHeight } =
    props;

  // const [imgSrc, setImgSrc] = useState(fallbackSrc); //高画質: src 低画質: fallbackSrc

  // const handleImageLoad = useCallback((src: string) => {
  //   const img = new window.Image();
  //   img.src = src;
  //   img.onload = () => {
  //     if (img.width === 120) {
  //       setImgSrc(fallbackSrc);
  //     }
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   handleImageLoad(src);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [src]);

  // const [isLoading, setIsLoading] = useState(true); // 画像の読み込み状態を管理

  // const handleImageLoad = () => {
  //   setIsLoading(false); // 画像が読み込まれたら、ローディング状態を解除
  // };

  const width = useBreakpointValue(thumnailWidth); // ここを変更
  const height = useBreakpointValue(thumnailHeight); // ここを変更
  return (
    <Box position="relative" className="group" minW={width} minH={height}>
      <Image
        loader={({ src }) => src}
        alt={alt}
        src={fallbackSrc}
        width={width}
        height={height}
        rounded="md"
      />
      <ThumbnailPreviewCover mapPreviewTime={mapPreviewTime} mapVideoId={mapVideoId} />
    </Box>
  );
};

export default MapLeftThumbnail;
