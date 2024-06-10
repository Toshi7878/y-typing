import { createSlice } from "@reduxjs/toolkit";

export const mapDataSlice = createSlice({
  name: "mapData",
  initialState: {
    value: [{ time: "0", lyrics: "", word: "" }],
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
      const adjustTime = Number(action.payload);
      const newValue = [...state.value];

      const lastLineTime = Number(state.value[state.value.length - 1]["time"]);

      for (let i = 1; i < newValue.length; i++) {
        const time = Number(state.value[i]["time"]);

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

        state.value = newValue;
      }
    },

    mapDataUndoRedo: (state, action) => {
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
          newValue[present.data.lineNumber] = {
            time: present.data.time,
            lyrics: present.data.lyrics,
            word: present.data.word,
          };
          break;
        case "delete":
          newValue.splice(present.data.lineNumber, 0, {
            time: present.data.time,
            lyrics: present.data.lyrics,
            word: present.data.word,
          });
          break;
      }

      state.value = newValue.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
    },
  },
});

export const { addLine, updateLine, deleteLine, allAdjustTime, mapDataUndoRedo } =
  mapDataSlice.actions;
export default mapDataSlice.reducer;
