"use client";
import {
  useLineResultsAtom,
  useLineSelectIndexAtom,
  useMapAtom,
  useSceneAtom,
  useSetLineSelectIndexAtom,
} from "@/app/type/type-atoms/gameRenderAtoms";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import { LineResultData } from "@/app/type/ts/type";

import { useCallback, useEffect, useMemo, useRef } from "react";
import ResultCard from "./ResultCard";
import { Ticker } from "@pixi/ticker";
import React from "react";

interface ResultLineListProps {
  modalContentRef: React.RefObject<HTMLDivElement>;
  onClose: () => void;
}

function ResultLineList({ modalContentRef, onClose }: ResultLineListProps) {
  const map = useMapAtom();
  const scene = useSceneAtom();
  const { playerRef, gameStateRef } = useRefs();
  const lineResults = useLineResultsAtom();

  const lineSelectIndex = useLineSelectIndexAtom();
  const setLineSelectIndex = useSetLineSelectIndexAtom();

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
        let nextTypedCount = 0;
        const typedElements = cardRefs.current[lineNumber].querySelectorAll(
          ".typed",
        ) as NodeListOf<HTMLElement>;

        const lastTypedChildClassList = typedElements[typedElements.length - 1].classList;

        if (lastTypedChildClassList[lastTypedChildClassList.length - 1] === "invisible") {
          return;
        }
        for (let i = 0; i < typedElements.length; i++) {
          typedElements[i].classList.add("invisible");
        }
        const date = new Date().getTime();
        const handleTick = () => handleResultCardReplay(date, typedElements);

        const ticker = new Ticker();
        const handleResultCardReplay = (date: number, typedElements: NodeListOf<HTMLElement>) => {
          const currentTime = (new Date().getTime() - date) / 1000;
          const nextCharElement = typedElements[nextTypedCount];

          if (typedElements.length - 1 < nextTypedCount) {
            ticker.stop();
            ticker.remove(handleTick);
            return;
          }

          const nextTime = nextCharElement.dataset.time;

          if (currentTime > Number(nextTime)) {
            nextCharElement.classList.remove("invisible");
            nextTypedCount++;
          }
        };

        if (!ticker.started) {
          ticker.add(handleTick);
          ticker.start();
        }
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
