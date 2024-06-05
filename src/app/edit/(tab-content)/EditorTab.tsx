import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Input, Box, Textarea } from "@chakra-ui/react";
import { timer } from "../(youtube-content)/timer";
import TabButton from "./(components)/TabButton";
import { ButtonEvents } from "./(components)/buttonEvent";
import { useDispatch } from "react-redux";
import { TabFormSchema } from "./validationSchema";

const EditorTab = () => {
  const { register, setValue, watch } = useFormContext();
  const dispatch = useDispatch();

  const time = watch("lineEditor.time");
  const lyrics = watch("lineEditor.lyrics");
  const word = watch("lineEditor.word");
  const lineNumber = watch("lineEditor.lineNumber");

  useEffect(() => {
    const updateRangeValue = () => {
      setValue("lineEditor.time", timer.currentTime);
    };
    timer.addListener(updateRangeValue);

    return () => {
      timer.removeListener(updateRangeValue);
    };
  }, [setValue]);

  const lineInit = () => {
    setValue("lineEditor.time", "");
    setValue("lineEditor.lyrics", "");
    setValue("lineEditor.word", "");
    setValue("lineEditor.lineNumber", "");
  };

  return (
    <form>
      <div>
        <Box display="flex" alignItems="center">
          {/* 後で時間が入ってないときは追加されないようにする */}
          <Input
            placeholder="Time"
            size="sm"
            width="90px"
            type="number"
            {...register("lineEditor.time")}
          />
          <Input
            placeholder="歌詞"
            size="sm"
            {...register("lineEditor.lyrics")}
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
            opacity={1}
            _disabled={{ opacity: 1 }}
            {...register("lineEditor.lineNumber")}
          />
          <Input
            placeholder="ワード"
            size="sm"
            {...register("lineEditor.word")}
          />
        </Box>
      </div>
      <div>
        <Box
          display="flex"
          className="flex justify-between"
          alignItems="center"
        >
          <TabButton
            colorScheme="teal"
            _hover={{ bg: "#6ee278ac" }}
            onClick={() => {
              ButtonEvents.addLine(dispatch, { time, lyrics, word });
              lineInit();
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
            onClick={() => {
              return;
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
          <Textarea placeholder="ここから歌詞をまとめて追加できます" />
        </Box>
      </div>
    </form>
  );
};

export default EditorTab;
