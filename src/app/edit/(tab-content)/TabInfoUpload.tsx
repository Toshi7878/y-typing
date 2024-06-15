import { useForm, FormProvider } from "react-hook-form";

import { Stack, useToast } from "@chakra-ui/react";

import { Line } from "./(ts)/buttonEvent";
import { forwardRef, useEffect, useState } from "react";
import { useRefs } from "../(contexts)/refsProvider";
import InfoInput from "./(components)/InfoInput";
import InfoGenreTag from "./(components)/InfoGenreTag";
import UploadButton from "./(components)/UploadButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../(redux)/store";
import { actions } from "./(ts)/serverActions";
import { useFormState } from "react-dom";
import { useParams, useRouter } from "next/navigation";
import { setCanUpload } from "../(redux)/buttonFlagsSlice";

export interface SendData {
  title: string;
  creatorComment: string;
  genre: string;
  tags: string[];
  mapData: Line[];
  videoId: string;
}

const TabInfoUpload = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const initialState = { id: null, message: "", status: 0 };
  const methods = useForm();
  const mapData = useSelector((state: RootState) => state.mapData.value);
  const { genre, tags } = useSelector((state: RootState) => state.genreTag);
  const toast = useToast();

  const { playerRef } = useRefs();
  const { id } = useParams();

  const upload = () => {
    const sendData = {
      videoId: playerRef.current.getVideoData().video_id,
      title: methods.getValues("title"),
      creatorComment: methods.getValues("creatorComment"),
      mapData,
      genre,
      tags: tags.map((tag) => tag.id),
    };

    const result = actions(sendData, Array.isArray(id) ? id[0] : id || "new");

    return result;
  };

  const [state, formAction] = useFormState(upload, initialState);
  const router = useRouter();
  useEffect(() => {
    async function handleStateChange() {
      if (state.status && state.status !== 200) {
        toast({
          title: "保存に失敗しました",
          description: <small>{state.message}</small>,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
          containerStyle: {
            border: "1px solid",

            borderColor: "gray.200",
            fontSize: "lg", // サイズを大きくする
          },
        });
      } else if (state.status === 200) {
        toast({
          title: state.message,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
          containerStyle: {
            border: "1px solid",

            borderColor: "gray.200",
            fontSize: "lg", // サイズを大きくする
          },
        });

        dispatch(setCanUpload(false));

        if (!id) {
          router.push(`/edit/${state.id}`);
        }
      }
    }
    handleStateChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  return (
    <FormProvider {...methods}>
      <form action={formAction}>
        <Stack display="flex" flexDirection="column" gap="6">
          <InfoInput />
          <InfoGenreTag />
          <UploadButton responseStatus={state.status} />
        </Stack>
      </form>
    </FormProvider>
  );
});

TabInfoUpload.displayName = "InfoUploadTab";

export default TabInfoUpload;
