import { useForm } from "react-hook-form";
import { Input, Box, Textarea, Flex, Button } from "@chakra-ui/react";
import { ButtonEvents } from "./(ts)/buttonEvent";
import { useDispatch, useSelector } from "react-redux";
import { TextAreaEvents } from "./(ts)/textAreaEvent";
import React, { useEffect } from "react";
import { timer } from "../(youtube-content)/timer";
import { RootState } from "../(redux)/store";
import { setIsLoadingWordConvertBtn } from "../(redux)/buttonLoadSlice";

const EditorTab = () => {
  // console.log("Editor");
  const { register, setValue, watch } = useForm();
  const dispatch = useDispatch();
  const selectedIndex = useSelector((state: RootState) => state.lineIndex.selectedIndex);
  const mapData = useSelector((state: RootState) => state.mapData.value);
  const isLoadingWordConvertBtn = useSelector(
    (state: RootState) => state.buttonLoad.isLoadingWordConvertBtn
  );
  const time = watch("EditorTab.time");
  const lyrics = watch("EditorTab.lyrics");
  const word = watch("EditorTab.word");
  const lineNumber = watch("EditorTab.lineNumber");
  const addLyrics = watch("EditorTab.addLyrics");

  const lineInit = () => {
    setValue("EditorTab.time", "");
    setValue("EditorTab.lyrics", "");
    setValue("EditorTab.word", "");
    setValue("EditorTab.lineNumber", "");
  };

  useEffect(() => {
    const updateTimeValue = () => {
      setValue("EditorTab.time", timer.currentTime);
    };

    timer.addListener(updateTimeValue);
    return () => {
      timer.removeListener(updateTimeValue);
    };
  }, [setValue]);

  useEffect(() => {
    if (selectedIndex !== null && mapData[selectedIndex]) {
      const line = mapData[selectedIndex];
      setValue("EditorTab.time", line.time || "");
      setValue("EditorTab.lyrics", line.lyrics || "");
      setValue("EditorTab.word", line.word || "");
      setValue("EditorTab.lineNumber", selectedIndex.toString());
    }
  }, [selectedIndex, mapData, setValue]);

  return (
    <form className="flex flex-col gap-y-1">
      <div>
        <Box display="flex" alignItems="center">
          {/* 後で時間が入ってないときは追加されないようにする */}
          <Input
            placeholder="Time"
            size="sm"
            width="90px"
            type="number"
            {...register("EditorTab.time")}
          />
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
              variant="outline"
              size="sm"
              width="120px"
              height="35px"
              colorScheme="teal"
              _hover={{ bg: "#6ee278ac" }}
              onClick={() => {
                const lyricsCopy = JSON.parse(JSON.stringify(lyrics));
                ButtonEvents.addLine(dispatch, { time, lyrics, word });
                lineInit();
                TextAreaEvents.deleteTopLyrics(setValue, lyricsCopy, addLyrics, dispatch);
              }}
            >
              追加
            </Button>
            <Button
              variant="outline"
              size="sm"
              width="120px"
              height="35px"
              colorScheme="cyan"
              _hover={{ bg: "#80f2fbac" }}
              onClick={() => {
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
              isLoading={isLoadingWordConvertBtn}
              variant="outline"
              size="sm"
              width="120px"
              height="35px"
              colorScheme="blue"
              _hover={{ bg: "#acceebc3" }}
              onClick={async () => {
                dispatch(setIsLoadingWordConvertBtn(true));
                await ButtonEvents.lyricsConvert(lyrics, setValue);
                dispatch(setIsLoadingWordConvertBtn(false));
              }}
            >
              読み変換
            </Button>
            <Button
              variant="outline"
              size="sm"
              width="120px"
              height="35px"
              colorScheme="red"
              _hover={{ bg: "#e26e6eac" }}
              onClick={() => {
                ButtonEvents.deleteLine(dispatch, lineNumber);
                lineInit();
              }}
            >
              削除
            </Button>
          </Flex>

          <Button
            variant="outline"
            size="sm"
            width="120px"
            height="35px"
            colorScheme=""
            _hover={{ bg: "#ebdf92bb" }}
            onClick={() => {}}
          >
            設定
          </Button>
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
  );
};

export default React.memo(EditorTab);
