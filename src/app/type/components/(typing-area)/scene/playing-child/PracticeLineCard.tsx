import React from "react";
import { Box, Card, useTheme } from "@chakra-ui/react";
import { useInteractJS } from "@/app/type/(ts)/scene-ts/hooks";
import { ThemeColors } from "@/types";
import ResultCardBody from "../result/child/child/ResultCardBody";
import { useAtomValue } from "jotai";
import {
  inputModeAtom,
  lineResultsAtom,
  lineSelectIndexAtom,
  mapAtom,
  speedAtom,
} from "@/app/type/(atoms)/gameRenderAtoms";
import ResultCardFooter from "../result/child/child/ResultCardFooter";
import { CHAR_POINT } from "@/app/type/(ts)/scene-ts/ready/createTypingWord";
import ResultCardHeader from "../result/child/child/ResultCardHeader";

const PracticeLineCard = () => {
  const interact = useInteractJS();
  const map = useAtomValue(mapAtom);
  const lineResults = useAtomValue(lineResultsAtom);
  const speedData = useAtomValue(speedAtom);
  const lineSelectIndex = useAtomValue(lineSelectIndexAtom);
  const inputMode = useAtomValue(inputModeAtom);
  const lineResult = lineResults[lineSelectIndex as number];
  const lineInputMode = lineResult.status?.mode ?? inputMode;
  const index = map!.typingLineNumbers[(lineSelectIndex! - 1) as number];
  const lineData = map!.mapData[index];
  const theme: ThemeColors = useTheme();

  // mapのLineデータ
  const maxLinePoint = lineData.notes.r * CHAR_POINT;
  const lineKanaWord = lineData.word.map((w) => w["k"]).join("");
  const lineNotes = lineInputMode === "roma" ? lineData.notes.r : lineData.notes.k;
  const lineSpeed =
    lineResult.status!.sp > speedData.defaultSpeed ? lineResult.status!.sp : speedData.defaultSpeed;
  const lineTime =
    (Number(map!.mapData[index + 1].time) - (index === 0 ? 0 : Number(lineData.time))) / lineSpeed;
  const lineKpm = (lineInputMode === "roma" ? lineData.kpm.r : lineData.kpm.k) * lineSpeed;

  //ユーザーのLineリザルトデータ
  const lineTypeWord =
    lineInputMode === "roma" ? lineData.word.map((w) => w["r"][0]).join("") : lineKanaWord;
  const lostWord = lineResult.status!.lostW;
  const point = lineResult.status?.p;
  const tBonus = lineResult.status?.tBonus;
  const kpm = lineResult.status?.lKpm;
  const rkpm = lineResult.status?.lRkpm;
  const lMiss = lineResult.status?.lMiss;

  return (
    <Card
      ref={interact.ref}
      py={4}
      pl={1}
      mb={4}
      gap={1}
      zIndex={100}
      style={{
        ...interact.style,
        height: "fit-content",
      }}
      bg={theme.colors.type.card.bg}
      color={theme.colors.type.card.color}
      outline={`1px solid ${theme.colors.type.card.borderColor}`}
      boxShadow={"lg"}
    >
      <ResultCardHeader
        index={index}
        lineCount={lineSelectIndex!}
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
        point={point!}
        tBonus={tBonus!}
        maxLinePoint={maxLinePoint}
        lMiss={lMiss!}
        kpm={kpm!}
        rkpm={rkpm!}
      />
    </Card>
  );
};

export default PracticeLineCard;
