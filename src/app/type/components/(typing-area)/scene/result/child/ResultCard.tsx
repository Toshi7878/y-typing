"use client";
import { inputModeAtom, mapAtom, sceneAtom, speedAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { CHAR_POINT } from "@/app/type/(ts)/scene-ts/ready/createTypingWord";
import { LineData, LineResultData } from "@/app/type/(ts)/type";
import { ThemeColors } from "@/types";
import { Card, useTheme } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { memo } from "react";
import ResultCardHeader from "./child/ResultCardHeader";
import ResultCardFooter from "./child/ResultCardFooter";
import ResultCardBody from "./child/ResultCardBody";

interface ResultCardProps {
  lineResult: LineResultData;
  index: number;
  lineCount: number;
  scoreCount: number;
  lineData: LineData;
  cardRefs: React.RefObject<HTMLDivElement[]>;
  lineSelectIndex: number | null;
  handleCardClick: (seekTime: number, index: number) => void;
}

function ResultCard({
  lineResult,
  index,
  lineCount,
  scoreCount,
  lineData,
  cardRefs,
  lineSelectIndex,
  handleCardClick,
}: ResultCardProps) {
  const map = useAtomValue(mapAtom);
  const inputMode = useAtomValue(inputModeAtom);
  const scene = useAtomValue(sceneAtom);
  const speedData = useAtomValue(speedAtom);
  const theme: ThemeColors = useTheme();

  const lineSpeed =
    lineResult.status!.sp > speedData.defaultSpeed ? lineResult.status!.sp : speedData.defaultSpeed;
  const lineInputMode = lineResult.status?.mode ?? inputMode;
  const lineKanaWord = lineData.word.map((w) => w["k"]).join("");
  const lineTypeWord =
    lineInputMode === "roma" ? lineData.word.map((w) => w["r"][0]).join("") : lineKanaWord;
  const lineNotes = lineInputMode === "roma" ? lineData.notes.r : lineData.notes.k;
  const lineTime =
    Number(map!.mapData[index + 1].time) - (index === 0 ? 0 : Number(lineData.time)) / lineSpeed;
  const lineKpm = (lineInputMode === "roma" ? lineData.kpm.r : lineData.kpm.k) / lineSpeed;

  const maxLinePoint = lineData.notes.r * CHAR_POINT;

  const kpm = lineResult.status?.lKpm;
  const rkpm = lineResult.status?.lRkpm;
  const point = lineResult.status?.p;
  const lMiss = lineResult.status?.lMiss;
  const tBonus = lineResult.status?.tBonus;
  const lostWord = lineResult.status?.lostW;

  const seekTime =
    Number(map!.mapData[index]["time"]) - (scene === "replay" ? 0 : 1 * speedData.playSpeed);

  const lineNumber = lineCount;

  return (
    <Card
      key={index}
      p={4}
      mb={4}
      ref={(el) => {
        if (el) cardRefs.current![lineCount] = el;
      }}
      data-seek-time={seekTime}
      data-line-number={lineNumber}
      data-count={index}
      size={"sm"}
      boxShadow="md"
      cursor="pointer"
      bg={theme.colors.type.card.bg}
      color={theme.colors.type.card.color}
      outline={
        lineSelectIndex === lineNumber
          ? `3px solid ${theme.colors.type.word.correct}`
          : "1px solid transparent"
      }
      _hover={{
        outline:
          lineSelectIndex === lineNumber
            ? `3px solid ${theme.colors.type.word.correct}`
            : `1px solid ${theme.colors.type.card.borderColor}`,
      }}
      onClick={() => handleCardClick(seekTime, lineNumber)}
    >
      <ResultCardHeader
        index={index}
        lineCount={lineCount}
        lineNotes={lineNotes}
        lineInputMode={lineInputMode}
        lineTime={lineTime}
        lineKpm={lineKpm}
        lineSpeed={lineSpeed}
      />
      <ResultCardBody
        lineKanaWord={lineKanaWord}
        typeResult={lineResult.typeResult}
        lineTypeWord={lineTypeWord}
        lostWord={lostWord!}
      />
      <ResultCardFooter
        scoreCount={scoreCount}
        point={point!}
        tBonus={tBonus!}
        maxLinePoint={maxLinePoint}
        lMiss={lMiss!}
        kpm={kpm!}
        rkpm={rkpm!}
      />
    </Card>
  );
}

export default memo(ResultCard);
