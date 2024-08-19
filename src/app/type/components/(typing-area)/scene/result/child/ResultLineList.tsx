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
  onClose: () => void;
}

function ResultLineList({ modalContentRef, onClose }: ResultLineListProps) {
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

  const handleCardClick = useCallback(
    (seekTime: number, lineNumber: number) => {
      if (scene !== "end") {
        onClose();
        gameStateRef.current!.isSeekedLine = true;
        if (scene === "replay") {
          playerRef.current.seekTo(seekTime);
        } else {
          playerRef.current.seekTo(0 > seekTime ? 0 : seekTime);
        }
        isManualScrollRef.current = true;
        setLineSelectIndex(lineNumber);
      } else {
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scene, onClose],
  );

  let lineCount = 0;
  let scoreCount = 0;

  const memoizedResultCards = useMemo(
    () =>
      lineResults.map((lineResult: LineResultData, index: number) => {
        const lineData = map!.mapData[index];

        if (!lineData.notes.k) {
          return null;
        }

        lineCount++;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        scoreCount += lineResult.status!.p! + lineResult.status!.tBonus!;

        lineResult;
        return (
          <ResultCard
            key={index}
            lineResult={lineResult}
            lineData={lineData}
            index={index}
            lineCount={lineCount}
            scoreCount={scoreCount}
            cardRefs={cardRefs}
            lineSelectIndex={lineSelectIndex}
            handleCardClick={handleCardClick}
          />
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lineResults, map, lineSelectIndex],
  );

  return <>{memoizedResultCards}</>;
}

export default ResultLineList;
