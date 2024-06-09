/* eslint-disable react-hooks/exhaustive-deps */
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

  const add = () => {
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
  };

  const update = () => {
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
  };

  const wordConvert = async () => {
    const lyrics = methods.getValues("lyrics");

    dispatch(setIsLoadingWordConvertBtn(true));
    await ButtonEvents.lyricsConvert(lyrics, setValue);
    dispatch(setIsLoadingWordConvertBtn(false));
  };

  const deleteLine = () => {
    const lineNumber = methods.getValues("lineNumber");

    ButtonEvents.deleteLine(dispatch, lineNumber);
    lineInit();
  };

  const buttonConfigs = [
    {
      ref: lineAddBtnRef,
      isDisabled: !isTimeInputValid,
      colorScheme: "teal",
      onClick: add,
      text: "追加",
    },
    {
      ref: lineUpdateBtnRef,
      isDisabled:
        !isTimeInputValid || !lineNumber || lineNumber === 0 || lineNumber === mapData.length - 1,
      colorScheme: "cyan",
      onClick: update,
      text: "変更",
    },
    {
      ref: lineDeleteBtnRef,
      isDisabled: lineNumber === mapData.length - 1,
      isLoading: isLoadingWordConvertBtn,
      colorScheme: "blue",
      onClick: wordConvert,
      text: "読み変換",
    },
    {
      isDisabled:
        !isTimeInputValid || !lineNumber || lineNumber === 0 || lineNumber === mapData.length - 1,
      colorScheme: "red",
      onClick: deleteLine,
      text: "削除",
    },
  ];

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
          <Box display="grid" gridTemplateColumns="1fr auto" gap="2" alignItems="center">
            <Flex gap="5">
              {buttonConfigs.map((config, index) => (
                <Button
                  key={index}
                  ref={config.ref}
                  isDisabled={config.isDisabled}
                  isLoading={config.isLoading}
                  variant="outline"
                  size="sm"
                  height="35px"
                  className="xl:w-[12%] lg:w-[19%]"
                  colorScheme={config.colorScheme}
                  _hover={{ bg: `${config.colorScheme}.100` }}
                  onClick={config.onClick}
                >
                  {config.text}
                </Button>
              ))}
            </Flex>
            <Box display="flex" justifyContent="flex-end">
              <EditorSettingModal />
            </Box>
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
