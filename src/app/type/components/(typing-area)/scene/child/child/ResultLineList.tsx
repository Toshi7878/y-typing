"use client";
import {
  lineResultsAtom,
  lineSelectIndexAtom,
  mapAtom,
  sceneAtom,
} from "@/app/type/(atoms)/gameRenderAtoms";
import { useRefs } from "@/app/type/(contexts)/refsProvider";
import { LineResultData } from "@/app/type/(ts)/type";

import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useRef } from "react";
import ResultCard from "./ResultCard";

interface ResultLineListProps {
  modalContentRef: React.RefObject<HTMLDivElement>;
}

function ResultLineList({ modalContentRef }: ResultLineListProps) {
  const map = useAtomValue(mapAtom);
  const scene = useAtomValue(sceneAtom);
  const { playerRef, gameStateRef } = useRefs();
  const lineResults = useAtomValue(lineResultsAtom);

  const [lineSelectIndex, setLineSelectIndex] = useAtom(lineSelectIndexAtom);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const isManualScrollRef = useRef(false);

  const scrollToCard = useCallback((newIndex: number) => {
    const card = cardRefs.current[newIndex];
    if (modalContentRef.current && card) {
      const scrollHeight = modalContentRef.current.scrollHeight;
      modalContentRef.current.scrollTop =
        (scrollHeight * (newIndex - 2)) / map!.typingLineNumbers.length;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (lineSelectIndex && isManualScrollRef.current === false) {
      scrollToCard(lineSelectIndex);
    }

    isManualScrollRef.current = false;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineSelectIndex]);

  let lineCount = 0;

  const handleCardClick = useCallback(
    (seekTime: number, lineNumber: number) => {
      gameStateRef.current!.isSeekedLine = true;
      if (scene === "replay") {
        playerRef.current.seekTo(seekTime);
      } else {
        playerRef.current.seekTo(0 > seekTime ? 0 : seekTime);
      }
      isManualScrollRef.current = true;
      setLineSelectIndex(lineNumber);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scene],
  );

  const memoizedResultCards = useMemo(
    () =>
      lineResults.map((lineResult: LineResultData, index: number) => {
        const lineData = map!.mapData[index];

        if (!lineData.notes.k) {
          return null;
        }

        lineCount++;
        return (
          <ResultCard
            key={index}
            lineResult={lineResult}
            lineData={lineData}
            index={index}
            lineCount={lineCount}
            cardRefs={cardRefs}
            lineSelectIndex={lineSelectIndex}
            handleCardClick={handleCardClick}
          />
        );
      }),
    [lineResults, map, lineCount, lineSelectIndex, handleCardClick],
  );

  return <>{memoizedResultCards}</>;
}

export default ResultLineList;
