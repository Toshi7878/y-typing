import { Image } from "@chakra-ui/next-js";
import React, { useState } from "react";

const ImageWithFallback = (props) => {
  const { src, fallbackSrc, alt } = props;
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      loader={({ src }) => {
        const img = new window.Image();
        img.src = src;
        img.onload = () => {
          if (img.width === 120) {
            setImgSrc(fallbackSrc);
          }
        };
        return src;
      }}
      alt={alt}
      src={imgSrc}
      width={220}
      height={120}
      minW={220}
      minH={120}
      className="cover rounded-md"
      style={{ aspectRatio: "16/9" }}
    />
  );
};

export default ImageWithFallback;
