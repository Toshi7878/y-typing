import { useForm, FormProvider } from "react-hook-form";
import { Input, Box, Textarea, Flex, Button } from "@chakra-ui/react";
import { ButtonEvents } from "./(ts)/buttonEvent";
import { useDispatch, useSelector } from "react-redux";
import { TextAreaEvents } from "./(ts)/textAreaEvent";
import React, { useEffect, useRef, useState } from "react";
import { RootState } from "../(redux)/store";
import { setIsLoadingWordConvertBtn } from "../(redux)/buttonLoadSlice";
import EditorTimeInput from "./(components)/EditorTimeInput";
import EditorSettingModal from "./(components)/EditorSettingModal";
import { useRefs } from "../(contexts)/refsProvider";

const EditorTab = () => {
  // console.log("Editor");
  const [isTimeInputValid, setIsTimeInputValid] = useState(false);
  const refs = useRefs();
  const timeInputRef = useRef<{ clearTime: () => void; getTime: () => string } | null>(null);
  const methods = useForm();
  const { register, setValue, watch } = methods;
  const lineNumber = Number(watch("lineNumber"));
  const dispatch = useDispatch();
  const selectedIndex = useSelector((state: RootState) => state.lineIndex.selectedIndex);
  const mapData = useSelector((state: RootState) => state.mapData.value);
  const isLoadingWordConvertBtn = useSelector(
    (state: RootState) => state.buttonLoad.isLoadingWordConvertBtn
  );

  const lineAddBtnRef = useRef(null);
  const lineUpdateBtnRef = useRef(null);
  const lineDeleteBtnRef = useRef(null);

  const lineInit = () => {
    setValue("lyrics", "");
    setValue("word", "");
    setValue("lineNumber", "");
    if (timeInputRef.current) {
      timeInputRef.current.clearTime(); // 実際のinputタグの数値も空にする
    }
  };

  useEffect(() => {
    if (selectedIndex !== null && mapData[selectedIndex]) {
      const line = mapData[selectedIndex];
      setValue("lyrics", line.lyrics || "");
      setValue("word", line.word || "");
      setValue("lineNumber", selectedIndex.toString());
    }
  }, [selectedIndex, setValue]);

  useEffect(() => {
    refs.setRef("lineAddBtn", lineAddBtnRef.current);
    refs.setRef("lineUpdateBtn", lineUpdateBtnRef.current);
    refs.setRef("lineDeleteBtn", lineDeleteBtnRef.current);
  }, [lineAddBtnRef, lineUpdateBtnRef, lineDeleteBtnRef]);

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-y-1">
        <div>
          <Box display="flex" alignItems="center">
            <EditorTimeInput ref={timeInputRef} onFormStateChange={setIsTimeInputValid} />
            <Input placeholder="歌詞" size="sm" autoComplete="off" {...register("lyrics")} />
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
              {...register("lineNumber")}
            />
            <Input placeholder="ワード" size="sm" autoComplete="off" {...register("word")} />
          </Box>
        </div>
        <div>
          <Box display="flex" className="flex justify-between" alignItems="center">
            <Flex gap="5">
              <Button
                ref={lineAddBtnRef}
                isDisabled={!isTimeInputValid}
                variant="outline"
                size="sm"
                width="30%"
                height="35px"
                colorScheme="teal"
                _hover={{ bg: "#6ee278ac" }}
                onClick={() => {
                  const time = timeInputRef.current!.getTime();
                  const lyrics = methods.getValues("lyrics");
                  const word = methods.getValues("word");
                  const addLyrics = methods.getValues("addLyrics");

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
                ref={lineUpdateBtnRef}
                isDisabled={
                  !isTimeInputValid ||
                  !lineNumber ||
                  lineNumber === 0 ||
                  lineNumber === mapData.length - 1
                }
                variant="outline"
                size="sm"
                width="30%"
                height="35px"
                colorScheme="cyan"
                _hover={{ bg: "#80f2fbac" }}
                onClick={() => {
                  const time = timeInputRef.current!.getTime();
                  const lyrics = methods.getValues("lyrics");
                  const word = methods.getValues("word");
                  const lineNumber = methods.getValues("lineNumber");

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
                ref={lineDeleteBtnRef}
                isDisabled={lineNumber === mapData.length - 1}
                isLoading={isLoadingWordConvertBtn}
                variant="outline"
                size="sm"
                width="30%"
                height="35px"
                colorScheme="blue"
                _hover={{ bg: "#acceebc3" }}
                onClick={async () => {
                  const lyrics = methods.getValues("lyrics");

                  dispatch(setIsLoadingWordConvertBtn(true));
                  await ButtonEvents.lyricsConvert(lyrics, setValue);
                  dispatch(setIsLoadingWordConvertBtn(false));
                }}
              >
                読み変換
              </Button>
              <Button
                isDisabled={
                  !isTimeInputValid ||
                  !lineNumber ||
                  lineNumber === 0 ||
                  lineNumber === mapData.length - 1
                }
                variant="outline"
                size="sm"
                width="30%"
                height="35px"
                colorScheme="red"
                _hover={{ bg: "#e26e6eac" }}
                onClick={() => {
                  const lineNumber = methods.getValues("lineNumber");

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
              {...register("addLyrics")}
              onPaste={() => {
                TextAreaEvents.paste(setValue, dispatch);
              }}
              onChange={(e) => {
                const lyrics = methods.getValues("lyrics");

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
