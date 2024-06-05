import { useFormContext } from "react-hook-form";
import { Input, Box } from "@chakra-ui/react";
import { usePlayer } from "../(youtube-content)/playerProvider";
import { useEffect } from "react";

const InfoTab = () => {
  const { playerRef } = usePlayer();
  const { register, setValue } = useFormContext();

  useEffect(() => {
    if (playerRef) {
    }
  }, [playerRef]);
  return (
    <form>
      <Box display="flex" flexDirection="column" gap="4">
        <Input placeholder="YouTube URL" size="sm" />
        <Input placeholder="タイトル" size="sm" />
      </Box>
    </form>
  );
};

export default InfoTab;
