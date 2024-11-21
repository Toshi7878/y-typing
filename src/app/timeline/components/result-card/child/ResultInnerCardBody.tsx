import { CardBody, Flex, useBreakpointValue, useTheme } from "@chakra-ui/react";
import React from "react";
import UserRank from "./child/UserRank";
import MapLeftThumbnail from "./child/MapCardLeftThumbnail";
import MapInfo from "./child/MapInfo";
import { ThemeColors } from "@/types";
import { ResultCardInfo } from "@/app/timeline/ts/type";
import { MapResultBadges } from "./child/MapResultBadgesLayout";

interface ResultInnerCardBodyProps {
  result: ResultCardInfo;
}
const ResultInnerCardBody = (props: ResultInnerCardBodyProps) => {
  const { result } = props;
  const theme: ThemeColors = useTheme();

  const src =
    result.map.thumbnailQuality === "maxresdefault"
      ? `https://i.ytimg.com/vi_webp/${result.map.videoId}/maxresdefault.webp`
      : `https://i.ytimg.com/vi/${result.map.videoId}/mqdefault.jpg`;

  const isToggledInputMode = result.romaType != 0 && result.kanaType != 0;
  const showBadges = useBreakpointValue({ base: false, md: true });

  return (
    <CardBody
      color={"color"}
      bgImage={`linear-gradient(to right,  ${"background.body"}, ${"background.body"}dd), url(${src})`} // 画像のみに黒いオーバーレイを追加
      bgSize="cover"
      bgPosition="center" // 画像の位置を20px下に調整
      borderRadius="lg"
      className="flex items-start"
      style={{ padding: 0, border: "none" }}
      mx={6}
    >
      <Flex
        py={6}
        direction="row"
        gap={4}
        justifyContent="space-between"
        w="100%"
        alignItems="center"
        zIndex={0}
      >
        <Flex direction="row" gap={4}>
          {showBadges && <UserRank userRank={result.rank} />}
          <MapLeftThumbnail
            alt={result.map.title}
            src={src}
            fallbackSrc={`https://i.ytimg.com/vi/${result.map.videoId}/mqdefault.jpg`}
            mapVideoId={result.map.videoId}
            mapPreviewTime={result.map.previewTime}
            thumbnailQuality={result.map.thumbnailQuality}
          />
          <MapInfo map={result.map} isToggledInputMode={isToggledInputMode} />
        </Flex>
        {showBadges && (
          <Flex justifyContent="flex-end">
            <MapResultBadges props={result} />
          </Flex>
        )}
      </Flex>
    </CardBody>
  );
};

export default ResultInnerCardBody;
