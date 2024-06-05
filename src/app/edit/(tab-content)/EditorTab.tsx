import { useFormContext } from "react-hook-form";
import { Input, Box, Textarea } from "@chakra-ui/react";
import TabButton from "./(components)/TabButton";
import { ButtonEvents } from "./(components)/buttonEvent";
import { useDispatch } from "react-redux";
import { TextAreaEvents } from "./(components)/textAreaEvent";
import React from "react";

const EditorTab = () => {
  console.log("Editor");
  const { register, setValue, watch } = useFormContext();
  const dispatch = useDispatch();

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

  return (
    <form className="flex flex-col gap-y-2">
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
          <TabButton
            colorScheme="teal"
            _hover={{ bg: "#6ee278ac" }}
            onClick={() => {
              const lyricsCopy = JSON.parse(JSON.stringify(lyrics));
              ButtonEvents.addLine(dispatch, { time, lyrics, word });
              lineInit();
              TextAreaEvents.deleteTopLyrics(setValue, lyricsCopy, addLyrics);
            }}
            text="追加"
          />
          <TabButton
            colorScheme="cyan"
            _hover={{ bg: "#80f2fbac" }}
            text="変更"
            onClick={() => {
              ButtonEvents.updateLine(dispatch, {
                time,
                lyrics,
                word,
                lineNumber,
              });
              lineInit();
            }}
          />
          <TabButton
            colorScheme="blue"
            _hover={{ bg: "#acceebc3" }}
            text="読み変換"
            onClick={async () => {
              const word = await ButtonEvents.lyricsConvert(lyrics, setValue);
            }}
          />
          <TabButton
            colorScheme="red"
            _hover={{ bg: "#e26e6eac" }}
            text="削除"
            onClick={() => {
              ButtonEvents.deleteLine(dispatch, lineNumber);
              lineInit();
            }}
          />
        </Box>
      </div>
      <div>
        <Box display="flex" alignItems="center">
          <Textarea
            placeholder="ここから歌詞をまとめて追加できます"
            style={{ height: "101px" }}
            {...register("EditorTab.addLyrics")}
            onPaste={() => {
              TextAreaEvents.paste(setValue);
            }}
          />
        </Box>
      </div>
    </form>
  );
};

export default React.memo(EditorTab);
