import { useForm, FormProvider } from "react-hook-form";

import { Stack } from "@chakra-ui/react";

import { Line } from "./(ts)/buttonEvent";
import { forwardRef } from "react";
import { useRefs } from "../(contexts)/refsProvider";
import InfoInput from "./(components)/InfoInput";
import InfoGenreTag from "./(components)/InfoGenreTag";
import UploadButton from "./(components)/UploadButton";
import { useSelector } from "react-redux";
import { RootState } from "../(redux)/store";

interface SendData {
  title: string;
  creatorComment: string;
  genre: string;
  tags: string[];
  mapData: Line[];
  videoId: string;
}

const TabInfoUpload = forwardRef((props, ref) => {
  const methods = useForm();
  const mapData = useSelector((state: RootState) => state.mapData.value);
  const { genre, tags } = useSelector((state: RootState) => state.genreTag);

  const { playerRef } = useRefs();
  const sendData = () => {
    console.log(playerRef.current.getVideoData().video_id);
    console.log(methods.getValues("title"));
    console.log(methods.getValues("creatorComment"));
    console.log(mapData);
    console.log(genre);
    console.log(tags);
  };

  return (
    <FormProvider {...methods}>
      <form action={sendData}>
        <Stack display="flex" flexDirection="column" gap="6">
          <InfoInput />
          <InfoGenreTag />
          <UploadButton />
        </Stack>
      </form>
    </FormProvider>
  );
});

TabInfoUpload.displayName = "InfoUploadTab";

export default TabInfoUpload;
