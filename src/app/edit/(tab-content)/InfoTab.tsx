import { useFormContext } from "react-hook-form";
import { Input, Box } from "@chakra-ui/react";
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
      player.addEventListener('onStateChange', onPlayerStateChange);
    }

    return () => {
      if (player) {
        player.removeEventListener('onStateChange', onPlayerStateChange);
      }
    };
  }, [playerRef, setValue]);

  return (
    <form>
      <Box display="flex" flexDirection="column" gap="4">
        <Input
          placeholder="YouTube URL"
          size="sm"
          {...register("InfoTab.url")}
        />
        <Input
          placeholder="タイトル"
          size="sm"
          {...register("InfoTab.title")}
        />
      </Box>
    </form>
  );
};

export default InfoTab;