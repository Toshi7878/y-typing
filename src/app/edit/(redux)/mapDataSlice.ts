import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

function adjustTimeForLine(
  newValue: RootState["mapData"]["value"],
  adjustTime: number,
  lastLineTime: number
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

  initialState: {
    lastAddedTime: "0",

    value: [
      {
        time: "0",

        lyrics: "",

        word: "",
      },

      {
        time: "13.422",

        lyrics: "君が代は",

        word: "きみがよは",
      },

      {
        time: "23.701",

        lyrics: "千代に八千代に",

        word: "ちよにやちよに",
      },

      {
        time: "34.488",

        lyrics: "さざれ石の",

        word: "さざれせきの",
      },

      {
        time: "45.530",

        lyrics: "巖となりて",

        word: "いわおとなりて",
      },

      {
        time: "56.058",

        lyrics: "苔のむすまで",

        word: "こけのむすまで",
      },

      {
        time: "73.909",

        lyrics: "",

        word: "",
      },

      {
        time: "82.461",

        lyrics: "end",

        word: "",
      },
    ],
  },

  reducers: {
    addLine: (state, action) => {
      const newValue = [...state.value, action.payload].sort(
        (a, b) => parseFloat(a.time) - parseFloat(b.time)
      );

      state.value = newValue;
    },

    updateLine: (state, action) => {
      const { lineNumber, time, lyrics, word } = action.payload;

      const newValue = [...state.value];

      newValue[Number(lineNumber)] = { time, lyrics, word };

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
  },
});

export const {
  addLine,
  updateLine,
  deleteLine,
  allAdjustTime,
  mapDataUndo,
  mapDataRedo,
  setLastAddedTime,
} = mapDataSlice.actions;

export default mapDataSlice.reducer;
