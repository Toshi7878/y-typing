import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { LineEdit } from "@/types";

interface MapDataState {
  lastAddedTime: string;
  value: LineEdit[];
}

const initialState: MapDataState = {
  lastAddedTime: "0", //テーブル内をスクロールする処理で使用

  value: [
    {
      time: "0",

      lyrics: "",

      word: "",
    },
    {
      time: "Infinity",

      lyrics: "end",

      word: "",
    },
  ],
};
function adjustTimeForLine(
  newValue: RootState["mapData"]["value"],
  adjustTime: number,
  lastLineTime: number,
) {
  for (let i = 1; i < newValue.length; i++) {
    const time = Number(newValue[i]["time"]);

    if (i === newValue.length - 1) {
      break;
    }

    if (time + adjustTime <= 0) {
      newValue[i]["time"] = "0.001";
    } else if (time + adjustTime >= lastLineTime) {
      newValue[i]["time"] = (lastLineTime - 0.001).toFixed(3);
    } else {
      newValue[i]["time"] = (time + adjustTime).toFixed(3);
    }
  }
  return newValue;
}

export const mapDataSlice = createSlice({
  name: "mapData",
  initialState, // initialStateを追加

  reducers: {
    setMapData: (state, action) => {
      state.value = action.payload.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
    },

    addLine: (state, action) => {
      const newValue = [...state.value, action.payload].sort(
        (a, b) => parseFloat(a.time) - parseFloat(b.time),
      );

      state.value = newValue;
    },

    updateLine: (state, action) => {
      const { selectedLineCount, time, lyrics, word } = action.payload;

      const newValue = [...state.value];

      newValue[selectedLineCount] = { time, lyrics, word };

      state.value = newValue.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
    },

    deleteLine: (state, action) => {
      const lineNumber = Number(action.payload);

      state.value = state.value.filter((_, index) => index !== lineNumber);
    },

    allAdjustTime: (state, action) => {
      const newValue = [...state.value];
      const adjustTime = Number(action.payload);
      const lastLineTime = Number(state.value[state.value.length - 1]["time"]);
      state.value = adjustTimeForLine(newValue, adjustTime, lastLineTime);
    },

    setLineOption: (state, action) => {
      const { options, number } = action.payload;
      const newValue = [...state.value];
      const optionsKey = Object.keys({ ...options }).filter((option) => option === "");
      newValue[number] = { ...newValue[number], options };
      state.value = newValue.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
    },

    // Ctrl + Z

    mapDataUndo: (state, action) => {
      const present = action.payload;

      const newValue = [...state.value];

      switch (present.type) {
        case "add":
          for (let i = 0; i < newValue.length; i++) {
            if (JSON.stringify(newValue[i]) === JSON.stringify(present.data)) {
              newValue.splice(i, 1);

              break;
            }
          }

          break;

        case "update":
          newValue[present.data.lineNumber] = present.data.old;

          break;

        case "delete":
          const time = present.data.time;

          const lyrics = present.data.lyrics;

          const word = present.data.word;
          newValue.push({ time, lyrics, word });

          break;

        case "allAdjustTime":
          for (let i = 0; i < newValue.length; i++) {
            newValue[i]["time"] = present.data.times[i];
          }

          break;
      }

      state.value = newValue.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
    },

    // Ctrl + Y

    mapDataRedo: (state, action) => {
      const present = action.payload;

      let newValue = [...state.value];

      switch (present.type) {
        case "add":
          newValue.push(present.data);

          break;

        case "update":
          newValue[present.data.lineNumber] = present.data.new;

          break;

        case "delete":
          newValue = newValue.filter((_, index) => index !== Number(present.data.lineNumber));

          break;

        case "allAdjustTime":
          const adjustTime = Number(action.payload.data.adjustTime);
          const lastLineTime = Number(state.value[state.value.length - 1]["time"]);
          state.value = adjustTimeForLine(newValue, adjustTime, lastLineTime);
          break;
      }

      state.value = newValue.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
    },

    setLastAddedTime(state, action) {
      state.lastAddedTime = action.payload;
    },

    resetMapData(state) {
      state.value = initialState.value;
    },
  },
});

export const {
  addLine,
  updateLine,
  deleteLine,
  setLineOption,
  allAdjustTime,
  mapDataUndo,
  mapDataRedo,
  setLastAddedTime,
  setMapData,
  resetMapData,
} = mapDataSlice.actions;

export default mapDataSlice.reducer;
