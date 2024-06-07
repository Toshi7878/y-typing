import { useFormContext } from "react-hook-form";

import { Input, Box, FormLabel, Flex } from "@chakra-ui/react";

import { usePlayer } from "../(youtube-content)/playerProvider";

import { useEffect } from "react";

const InfoTab = () => {
  const { playerRef } = usePlayer();

  const { register, setValue } = useFormContext();

  useEffect(() => {
    const onPlayerStateChange = () => {
      if (playerRef) {
        const videoData = playerRef?.current?.getInternalPlayer()?.getVideoData();

        if (videoData) {
          const { title, video_id } = videoData;

          const url = `https://www.youtube.com/watch?v=${video_id}`;

          setValue("InfoTab.title", title);

          setValue("InfoTab.url", url);
        }
      }
    };

    const player = playerRef?.current?.getInternalPlayer();

    if (player) {
      player.addEventListener("onStateChange", onPlayerStateChange);
    }

    return () => {
      if (player) {
        player.removeEventListener("onStateChange", onPlayerStateChange);
      }
    };
  }, [playerRef, setValue]);

  return (
    <form>
      <Box display="flex" flexDirection="column" gap="3">
        <Flex alignItems="center">
          <FormLabel mb="0" width="150px" fontWeight="bold">
            YouTube URL
          </FormLabel>

          <Input
            placeholder="YouTube URL"
            size="sm"
            {...register("InfoTab.url")}
            fontWeight="bold"
          />
        </Flex>

        <Flex alignItems="center">
          <FormLabel mb="0" width="150px" fontWeight="bold">
            タイトル
          </FormLabel>

          <Input
            placeholder="タイトル"
            size="sm"
            {...register("InfoTab.title")}
            fontWeight="bold"
          />
        </Flex>
      </Box>
    </form>
  );
};

export default InfoTab;
