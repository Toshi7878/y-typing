import React from "react";
import { Card, useTheme } from "@chakra-ui/react";
import { useInteractJS } from "@/app/type/(ts)/scene-ts/hooks";
import { ThemeColors } from "@/types";
import ResultCardBody from "../result/child/child/ResultCardBody";
import { useAtomValue } from "jotai";
import {
  inputModeAtom,
  lineResultsAtom,
  lineSelectIndexAtom,
  mapAtom,
} from "@/app/type/(atoms)/gameRenderAtoms";

const PracticeLineCard = () => {
  const interact = useInteractJS();
  const map = useAtomValue(mapAtom);
  const lineResults = useAtomValue(lineResultsAtom);
  const lineSelectIndex = useAtomValue(lineSelectIndexAtom);
  const inputMode = useAtomValue(inputModeAtom);

  const theme: ThemeColors = useTheme();
  const lineCount = map!.typingLineNumbers[(lineSelectIndex! - 1) as number];
  const lineData = map!.mapData[lineCount];

  const lineResult = lineResults[lineSelectIndex as number];
  const lineInputMode = lineResult.status?.mode ?? inputMode;

  const lineKanaWord = lineData.word.map((w) => w["k"]).join("");
  const lineTypeWord =
    lineInputMode === "roma" ? lineData.word.map((w) => w["r"][0]).join("") : lineKanaWord;
  const lostWord = lineResult.status!.lostW;

  return (
    <Card
      ref={interact.ref}
      zIndex={100}
      style={{
        ...interact.style, // <= 追加する
      }}
      bg={theme.colors.type.card.bg}
      color={theme.colors.type.card.color}
      outline={`1px solid ${theme.colors.type.card.borderColor}`}
      boxShadow={"lg"}
    >
      <ResultCardBody
        lineKanaWord={lineKanaWord}
        typeResult={lineResult.typeResult}
        lineTypeWord={lineTypeWord}
        lostWord={lostWord!}
      />
    </Card>
  );
};

export default PracticeLineCard;
