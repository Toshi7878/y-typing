import React, { useEffect, useState } from "react";

import { Input, Box, Textarea } from "@chakra-ui/react";
import { timer } from "../(youtube-content)/timer";
import TabButton from "./(components)/TabButton";
import { ButtonEvents } from "./(components)/buttonEvent";
import { useDispatch, useSelector } from "react-redux";
import { setLyrics, setTime, setWord } from "../(redux)/selectLineSlice";
import { RootState } from "../(redux)/store";

const Editor = () => {
  const dispatch = useDispatch();
  const lineNumber = useSelector((state: RootState) => state.selectLine.number);
  const time = useSelector((state: RootState) => state.selectLine.time);
  const lyrics = useSelector((state: RootState) => state.selectLine.lyrics);
  const word = useSelector((state: RootState) => state.selectLine.word);

  useEffect(() => {
    const updateRangeValue = () => dispatch(setTime(timer.currentTime));
    timer.addListener(updateRangeValue);

    return () => {
      timer.removeListener(updateRangeValue);
    };
  }, []);
  return (
    <div>
      <div>
        <Box display="flex" alignItems="center">
          <Input
            placeholder="Time"
            size="sm"
            width="90px"
            value={time}
            type="number"
            onChange={(e) => dispatch(setTime(e.target.value))}
          />
          <Input
            placeholder="歌詞"
            size="sm"
            value={lyrics}
            onChange={(e) => dispatch(setLyrics(e.target.value))}
          />
        </Box>
      </div>
      <div>
        <Box display="flex" alignItems="center">
          <Input
            placeholder="No."
            value={lineNumber}
            size="sm"
            width="90px"
            disabled
          />
          <Input
            placeholder="ワード"
            size="sm"
            value={word}
            onChange={(e) => dispatch(setWord(e.target.value))}
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
            onClick={() =>
              ButtonEvents.addLine(dispatch, { time, lyrics, word })
            }
            text="追加"
          />
          <TabButton
            colorScheme="cyan"
            _hover={{ bg: "#80f2fbac" }}
            text="変更"
            onClick={() =>
              ButtonEvents.updateLine(
                dispatch,
                { time, lyrics, word },
                lineNumber
              )
            }
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
              return;
            }}
          />
        </Box>
      </div>
      <div>
        <Box display="flex" alignItems="center">
          <Textarea placeholder="ここから歌詞をまとめて追加できます" />
        </Box>
      </div>
    </div>
  );
};

export default Editor;
