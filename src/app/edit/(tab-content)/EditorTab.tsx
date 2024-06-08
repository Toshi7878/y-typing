import { useForm, FormProvider } from "react-hook-form";
import { Input, Box, Textarea, Flex, Button } from "@chakra-ui/react";
import { ButtonEvents } from "./(ts)/buttonEvent";
import { useDispatch, useSelector } from "react-redux";
import { TextAreaEvents } from "./(ts)/textAreaEvent";
import React, { useEffect } from "react";
import { RootState } from "../(redux)/store";
import { setIsLoadingWordConvertBtn } from "../(redux)/buttonLoadSlice";
import EditorTimeInput from "./(components)/EditorTimeInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import EditorSettingModal from "./(components)/EditorSettingModal";

const schema = z.object({
  time: z.string().min(1),
});

const EditorTab = () => {
  // console.log("Editor");
  const methods = useForm({
    mode: "all",
    resolver: zodResolver(schema),
    criteriaMode: "all",
  });
  const {
    register,
    setValue,
    formState: { isValid, errors },
  } = methods;

  const dispatch = useDispatch();
  const selectedIndex = useSelector((state: RootState) => state.lineIndex.selectedIndex);
  const mapData = useSelector((state: RootState) => state.mapData.value);
  const isLoadingWordConvertBtn = useSelector(
    (state: RootState) => state.buttonLoad.isLoadingWordConvertBtn
  );

  const lineInit = () => {
    setValue("time", "", { shouldValidate: true });
    setValue("EditorTab.lyrics", "");
    setValue("EditorTab.word", "");
    setValue("EditorTab.lineNumber", "");
  };

  useEffect(() => {
    if (selectedIndex !== null && mapData[selectedIndex]) {
      const line = mapData[selectedIndex];
      setValue("time", line.time || "", { shouldValidate: true });
      setValue("EditorTab.lyrics", line.lyrics || "");
      setValue("EditorTab.word", line.word || "");
      setValue("EditorTab.lineNumber", selectedIndex.toString());
    }
  }, [selectedIndex, mapData, setValue]);

  const lineNumber = Number(methods.getValues("EditorTab.lineNumber"));

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-y-1">
        <div>
          <Box display="flex" alignItems="center">
            <EditorTimeInput />
            <Input
              placeholder="歌詞"
              size="sm"
              autoComplete="off"
              {...register("EditorTab.lyrics")}
            />
          </Box>
        </div>
        <div>
          <Box display="flex" alignItems="center">
            <Input
              placeholder="No."
              size="sm"
              width="90px"
              disabled
              variant="filled"
              opacity={1}
              _disabled={{ opacity: 1 }}
              {...register("EditorTab.lineNumber")}
            />
            <Input
              placeholder="ワード"
              size="sm"
              autoComplete="off"
              {...register("EditorTab.word")}
            />
          </Box>
        </div>
        <div>
          <Box display="flex" className="flex justify-between" alignItems="center">
            <Flex gap="5">
              <Button
                isDisabled={!isValid}
                variant="outline"
                size="sm"
                width="25%"
                height="35px"
                colorScheme="teal"
                _hover={{ bg: "#6ee278ac" }}
                onClick={() => {
                  const time = methods.getValues("time");
                  const lyrics = methods.getValues("EditorTab.lyrics");
                  const word = methods.getValues("EditorTab.word");
                  const addLyrics = methods.getValues("EditorTab.addLyrics");

                  const lyricsCopy = JSON.parse(JSON.stringify(lyrics));
                  ButtonEvents.addLine(dispatch, { time, lyrics, word });
                  lineInit();

                  if (lyricsCopy) {
                    TextAreaEvents.deleteTopLyrics(setValue, lyricsCopy, addLyrics, dispatch);
                  }
                }}
              >
                追加
              </Button>
              <Button
                isDisabled={
                  !isValid || !lineNumber || lineNumber === 0 || lineNumber === mapData.length - 1
                }
                variant="outline"
                size="sm"
                width="25%"
                height="35px"
                colorScheme="cyan"
                _hover={{ bg: "#80f2fbac" }}
                onClick={() => {
                  const time = methods.getValues("time");
                  const lyrics = methods.getValues("EditorTab.lyrics");
                  const word = methods.getValues("EditorTab.word");
                  const lineNumber = methods.getValues("EditorTab.lineNumber");
                  ButtonEvents.updateLine(dispatch, {
                    time,
                    lyrics,
                    word,
                    lineNumber,
                  });
                  lineInit();
                }}
              >
                変更
              </Button>

              <Button
                isDisabled={lineNumber === 0 || lineNumber === mapData.length - 1}
                isLoading={isLoadingWordConvertBtn}
                variant="outline"
                size="sm"
                width="25%"
                height="35px"
                colorScheme="blue"
                _hover={{ bg: "#acceebc3" }}
                onClick={async () => {
                  const lyrics = methods.getValues("EditorTab.lyrics");

                  dispatch(setIsLoadingWordConvertBtn(true));
                  await ButtonEvents.lyricsConvert(lyrics, setValue);
                  dispatch(setIsLoadingWordConvertBtn(false));
                }}
              >
                読み変換
              </Button>
              <Button
                isDisabled={
                  !isValid || !lineNumber || lineNumber === 0 || lineNumber === mapData.length - 1
                }
                variant="outline"
                size="sm"
                width="25%"
                height="35px"
                colorScheme="red"
                _hover={{ bg: "#e26e6eac" }}
                onClick={() => {
                  const lineNumber = methods.getValues("EditorTab.lineNumber");

                  ButtonEvents.deleteLine(dispatch, lineNumber);
                  lineInit();
                }}
              >
                削除
              </Button>
            </Flex>

            <EditorSettingModal />
          </Box>
        </div>
        <div>
          <Box display="flex" alignItems="center">
            <Textarea
              placeholder="ここから歌詞をまとめて追加できます"
              style={{ height: "92px" }}
              {...register("EditorTab.addLyrics")}
              onPaste={() => {
                TextAreaEvents.paste(setValue, dispatch);
              }}
              onChange={(e) => {
                const lyrics = methods.getValues("EditorTab.lyrics");

                const lines = e.target.value.split("\n");
                const topLyrics = lines[0].replace(/\r$/, "");
                if (topLyrics !== lyrics) {
                  TextAreaEvents.setTopLyrics(setValue, topLyrics, dispatch);
                }
              }}
            />
          </Box>
        </div>
      </form>
    </FormProvider>
  );
};

export default EditorTab;
