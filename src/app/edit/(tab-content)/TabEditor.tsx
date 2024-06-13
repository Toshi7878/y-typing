/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import { Input, Box, Textarea, Flex, Button } from "@chakra-ui/react";
import { ButtonEvents, Line } from "./(ts)/buttonEvent";
import { useDispatch, useSelector } from "react-redux";
import { TextAreaEvents } from "./(ts)/textAreaEvent";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { RootState } from "../(redux)/store";
import { setIsLoadingWordConvertBtn } from "../(redux)/buttonLoadSlice";
import EditorTimeInput from "./(components)/EditorTimeInput";
import EditorSettingModal from "./(components)/EditorSettingModal";
import { addHistory } from "../(redux)/undoredoSlice";
import { setSelectedIndex } from "../(redux)/lineIndexSlice";
import { setLastAddedTime } from "../(redux)/mapDataSlice";

const TabEditor = forwardRef((props, ref) => {
  // console.log("Editor");
  const [isTimeInputValid, setIsTimeInputValid] = useState(false);
  const timeInputRef = useRef<{
    clearTime: () => void;
    getTime: () => number;
    selectedTime: () => void;
    undoAdd: (time: Line["time"]) => void;
  } | null>(null);
  const editorSettingRef = useRef<{
    getTimeOffset: () => number;
    getWordConvertOption: () => string;
  } | null>(null);

  const methods = useForm();
  const { register, setValue, watch } = methods;
  const lineNumber = Number(watch("lineNumber"));
  const dispatch = useDispatch();
  const selectedIndex = useSelector((state: RootState) => state.lineIndex.selectedIndex);
  const mapData = useSelector((state: RootState) => state.mapData.value);

  const isLoadingWordConvertBtn = useSelector(
    (state: RootState) => state.buttonLoad.isLoadingWordConvertBtn
  );

  const lineInit = () => {
    setValue("lyrics", "");
    setValue("word", "");
    setValue("lineNumber", "");
    timeInputRef.current!.clearTime();
    dispatch(setSelectedIndex(null));
  };

  useEffect(() => {
    if (selectedIndex !== null && mapData[selectedIndex]) {
      const line = mapData[selectedIndex];
      setValue("lyrics", line.lyrics || "");
      setValue("word", line.word || "");
      setValue("lineNumber", selectedIndex.toString());
      timeInputRef.current!.selectedTime();
    }
  }, [selectedIndex, setValue, mapData]);

  const timeValidate = (time: number, mapData: RootState["mapData"]["value"]) => {
    const lastLineTime = Number(mapData[mapData.length - 1]["time"]);

    if (0 >= time) {
      return 0.001;
    } else if (lastLineTime <= time) {
      return lastLineTime - 0.001;
    } else {
      return time;
    }
  };

  const add = (mapData: RootState["mapData"]["value"]) => {
    const timeOffset = editorSettingRef.current!.getTimeOffset();
    const time = timeValidate(timeInputRef.current!.getTime() + timeOffset, mapData).toFixed(3);
    const lyrics = methods.getValues("lyrics");
    const word = methods.getValues("word");
    const addLyrics = methods.getValues("addLyrics");

    const lyricsCopy = JSON.parse(JSON.stringify(lyrics));
    dispatch(setLastAddedTime(time));
    ButtonEvents.addLine(dispatch, { time, lyrics, word });
    lineInit();

    if (lyricsCopy) {
      const convertOption = editorSettingRef.current!.getWordConvertOption();

      TextAreaEvents.deleteTopLyrics(setValue, lyricsCopy, addLyrics, dispatch, convertOption);
    }
  };

  const update = (mapData: RootState["mapData"]["value"]) => {
    const time = timeValidate(timeInputRef.current!.getTime(), mapData).toFixed(3);
    const lyrics: string = methods.getValues("lyrics");
    const word: string = methods.getValues("word");
    const lineNumber: string = methods.getValues("lineNumber");

    dispatch(
      addHistory({
        type: "update",
        data: { old: mapData[parseInt(lineNumber)], new: { time, lyrics, word }, lineNumber },
      })
    );

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
    const convertOption = editorSettingRef.current!.getWordConvertOption();

    dispatch(setIsLoadingWordConvertBtn(true));
    await ButtonEvents.lyricsConvert(lyrics, setValue, convertOption);
    dispatch(setIsLoadingWordConvertBtn(false));
  };

  const deleteLine = (mapData: RootState["mapData"]["value"]) => {
    const lineNumber: string = methods.getValues("lineNumber");
    if (lineNumber) {
      ButtonEvents.deleteLine(dispatch, { ...mapData[parseInt(lineNumber)], lineNumber });
    }
    lineInit();
  };

  const setAddLyrics = (e: React.ChangeEvent<HTMLTextAreaElement> | null) => {
    const lyrics = methods.getValues("lyrics");

    const lines = (
      e ? (e.target as HTMLTextAreaElement).value : methods.getValues("addLyrics")
    ).split("\n");
    const topLyrics = lines[0].replace(/\r$/, "");
    if (topLyrics !== lyrics) {
      const convertOption = editorSettingRef.current!.getWordConvertOption();

      TextAreaEvents.setTopLyrics(setValue, topLyrics, dispatch, convertOption);
    }
  };

  const buttonConfigs = {
    add: {
      isDisabled: !isTimeInputValid,
      colorScheme: "teal",
      onClick: () => {
        add(mapData);
        //フォーカスを外さないとクリック時にテーブルがスクロールされない
        (document.activeElement as HTMLElement)?.blur();
      },
      text: (
        <>
          追加<small className="hidden sm:inline">(S)</small>
        </>
      ),
      isLoading: false,
    },
    update: {
      isDisabled:
        !isTimeInputValid || !lineNumber || lineNumber === 0 || lineNumber === mapData.length - 1,
      colorScheme: "cyan",
      onClick: () => {
        update(mapData);
      },
      text: (
        <>
          変更<small className="hidden sm:inline">(U)</small>
        </>
      ),
      isLoading: false,
    },
    wordConvert: {
      isDisabled: lineNumber === mapData.length - 1,
      isLoading: isLoadingWordConvertBtn,
      colorScheme: "blue",
      onClick: wordConvert,
      text: "読み変換",
    },
    delete: {
      isDisabled:
        !isTimeInputValid || !lineNumber || lineNumber === 0 || lineNumber === mapData.length - 1,
      colorScheme: "red",
      onClick: () => {
        deleteLine(mapData);
      },
      text: (
        <>
          削除<small className="hidden sm:inline">(Del)</small>
        </>
      ),
      isLoading: false,
    },
  };

  useImperativeHandle(ref, () => ({
    add: (mapData: RootState["mapData"]["value"]) => {
      if (buttonConfigs.add.isDisabled) {
        add(mapData);
      }
    },
    update: (mapData: RootState["mapData"]["value"]) => {
      if (buttonConfigs.update.isDisabled) {
        update(mapData);
      }
    },
    delete: (mapData: RootState["mapData"]["value"]) => {
      if (buttonConfigs.delete.isDisabled) {
        deleteLine(mapData);
      }
    },
    undoAddLyrics: (undoLine: Line) => {
      const addLyrics = methods.getValues("addLyrics");

      TextAreaEvents.undoTopLyrics(setValue, undoLine, addLyrics);
      timeInputRef.current!.undoAdd(undoLine.time);
    },

    setAddLyrics: () => {
      setAddLyrics(null);
    },

    lineInit: () => {
      lineInit();
    },

    redoAddLyrics: (redoLine: Line) => {
      const lyrics = redoLine.lyrics;
      const addLyrics = methods.getValues("addLyrics");
      const convertOption = editorSettingRef.current!.getWordConvertOption();

      TextAreaEvents.deleteTopLyrics(setValue, lyrics, addLyrics, dispatch, convertOption);
    },
  }));

  return (
    <form className="flex flex-col gap-y-1">
      <Box display="flex" alignItems="center">
        <EditorTimeInput ref={timeInputRef} onFormStateChange={setIsTimeInputValid} />
        <Input placeholder="歌詞" size="sm" autoComplete="off" {...register("lyrics")} />
      </Box>
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
      <Box display="grid" gridTemplateColumns="1fr auto" gap="2" alignItems="center">
        <Flex gap="5">
          {Object.values(buttonConfigs).map((config, index) => (
            <Button
              key={index}
              isDisabled={config.isDisabled}
              isLoading={config.isLoading}
              variant="outline"
              size="sm"
              height="35px"
              className="w-[16%] xl:w-[12%] lg:w-[19%] md:w-[19%]"
              colorScheme={config.colorScheme}
              _hover={{ bg: `${config.colorScheme}.100` }}
              onClick={config.onClick}
            >
              {config.text}
            </Button>
          ))}
          <EditorSettingModal ref={editorSettingRef} />
        </Flex>
      </Box>
      <Box display="flex" alignItems="center">
        <Textarea
          placeholder="ここから歌詞をまとめて追加できます"
          style={{ height: "92px" }}
          {...register("addLyrics")}
          onPaste={() => {
            const convertOption = editorSettingRef.current!.getWordConvertOption();
            TextAreaEvents.paste(setValue, dispatch, convertOption);
          }}
          onChange={(e) => setAddLyrics(e)}
        />
      </Box>
    </form>
  );
});

TabEditor.displayName = "EditorTab";

export default TabEditor;
