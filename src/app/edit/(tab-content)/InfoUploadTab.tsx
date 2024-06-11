import { useForm, FormProvider } from "react-hook-form";

import { Stack } from "@chakra-ui/react";

import { Line } from "./(ts)/buttonEvent";
import { forwardRef } from "react";
import { useRefs } from "../(contexts)/refsProvider";
import InfoInput from "./(components)/InfoInput";
import InfoGenreTag from "./(components)/InfoGenreTag";
import UploadButton from "./(components)/UploadButton";

interface SendData {
  title: string;
  creatorComment: string;
  genre: string;
  tags: string[];
  mapData: Line[];
  videoId: string;
}

const InfoUploadTab = forwardRef((props, ref) => {
  const methods = useForm();

  const { playerRef } = useRefs();
  const sendData = () => {
    console.log(playerRef.current.getVideoData().video_id);
    console.log(methods.getValues("title"));
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

InfoUploadTab.displayName = "InfoUploadTab";

export default InfoUploadTab;
