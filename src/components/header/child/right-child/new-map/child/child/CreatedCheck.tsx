import MapCard from "@/app/(home)/components/MapCard";
import { useCreatedCheckVideoIdQuery } from "@/lib/hooks/fetcher-hook/useCreatedCheckVideoIdQuery";
import { Box, Spinner } from "@chakra-ui/react";
import React from "react";

interface CreatedCheckProps {
  videoId: string;
}

const CreatedCheck = (props: CreatedCheckProps) => {
  const { data, error, isLoading } = useCreatedCheckVideoIdQuery(props.videoId);

  if (isLoading) {
    return <Spinner size="sm" />;
  }

  if (data && data.length) {
    return (
      <Box>
        <Box fontSize="lg" fontWeight="bold" my={3}>
          この動画の譜面が{data.length}件見つかりました
        </Box>
        {data.map((item, index) => (
          <Box key={index} mb={2}>
            <MapCard map={item} maxW={"610px"} />
          </Box>
        ))}
      </Box>
    );
  } else {
    return (
      <Box fontSize="lg" fontWeight="bold" my={3}>
        この動画の譜面は見つかりませんでした
      </Box>
    );
  }
};

export default CreatedCheck;
