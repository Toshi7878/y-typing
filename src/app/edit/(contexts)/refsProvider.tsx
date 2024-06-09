import React, { createContext, useContext, useRef } from "react";

export interface RefsContextType {
  lineAddBtn: React.RefObject<HTMLElement>;
  lineUpdateBtn: React.RefObject<HTMLElement>;
  lineDeleteBtn: React.RefObject<HTMLElement>;
  tableRef: React.RefObject<HTMLElement>;
  playerRef: any;
  setRef: (key: string, ref: HTMLElement | any) => void;
}

// Start of Selection
const RefsContext = createContext<RefsContextType>({
  lineAddBtn: { current: null },
  lineUpdateBtn: { current: null },
  lineDeleteBtn: { current: null },
  tableRef: { current: null },
  playerRef: null,
  setRef: (ref: HTMLElement | any) => {},
});
export const RefsProvider = ({ children }) => {
  const lineAddBtn = useRef(null);
  const lineUpdateBtn = useRef(null);
  const lineDeleteBtn = useRef(null);
  const tableRef = useRef(null);
  const playerRef = useRef(null);

  const setRef = (key: string, ref: React.RefObject<HTMLElement> | any) => {
    switch (key) {
      case "lineAddBtn":
        lineAddBtn.current = ref;
        break;
      case "lineUpdateBtn":
        lineUpdateBtn.current = ref;
        break;
      case "lineDeleteBtn":
        lineDeleteBtn.current = ref;
        break;
      case "tableRef":
        tableRef.current = ref;
        break;
      case "playerRef":
        playerRef.current = ref;
        break;
      default:
        break;
    }
  };

  return (
    <RefsContext.Provider
      value={{ lineAddBtn, lineUpdateBtn, lineDeleteBtn, tableRef, playerRef, setRef }}
    >
      {children}
    </RefsContext.Provider>
  );
};

export const useRefs = () => {
  const context = useContext(RefsContext);
  return {
    lineAddBtn: context.lineAddBtn,
    lineUpdateBtn: context.lineUpdateBtn,
    lineDeleteBtn: context.lineDeleteBtn,
    tableRef: context.tableRef,
    playerRef: context.playerRef,
    setRef: context.setRef,
  };
};
