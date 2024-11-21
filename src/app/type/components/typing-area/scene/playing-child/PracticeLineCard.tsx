import { Card, CardBody, CardFooter, CardHeader, useTheme } from "@chakra-ui/react";
import { useInteractJS } from "@/app/type/ts/scene-ts/hooks";
import { ThemeColors } from "@/types";
import ResultCardBody from "../result/child/child/ResultCardBody";
import {
  useInputModeAtom,
  useLineResultsAtom,
  useLineSelectIndexAtom,
  useMapAtom,
  useTypePageSpeedAtom,
} from "@/app/type/type-atoms/gameRenderAtoms";
import ResultCardFooter from "../result/child/child/ResultCardFooter";
import { CHAR_POINT } from "@/app/type/ts/scene-ts/ready/createTypingWord";
import ResultCardHeader from "../result/child/child/ResultCardHeader";
import { useState } from "react";
import { useMoveLine } from "@/app/type/hooks/playing-hooks/useMoveLine";

const PracticeLineCard = () => {
  const interact = useInteractJS();
  const map = useMapAtom();
  const lineResults = useLineResultsAtom();
  const speedData = useTypePageSpeedAtom();
  const lineSelectIndex = useLineSelectIndexAtom();
  const inputMode = useInputModeAtom();
  const index = map!.typingLineNumbers[(lineSelectIndex! - 1) as number];
  const lineResult = lineResults[index as number];
  const lineInputMode = lineResult.status?.mode ?? inputMode;

  const lineData = map!.mapData[index];
  const theme: ThemeColors = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const { moveSetLine } = useMoveLine();

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
      bg={theme.colors.background.card}
      color={"text.body"}
      outline={`1px solid ${"border.card"}`}
      boxShadow={"lg"}
      _hover={{
        bg: theme.colors.button.sub,
      }}
      cursor={isDragging ? "move" : "pointer"}
      onMouseDown={() => setIsDragging(false)}
      onMouseMove={() => setIsDragging(true)}
      onClick={() => {
        if (!isDragging) {
          moveSetLine();
        }
      }}
    >
      <CardHeader py={0}>
        <ResultCardHeader
          index={index}
          lineCount={lineSelectIndex!}
          lineNotes={lineNotes}
          lineInputMode={lineInputMode}
          lineTime={lineTime}
          lineKpm={lineKpm}
          lineSpeed={lineSpeed}
        />
      </CardHeader>
      <CardBody py={0} className="text-md word-font">
        <ResultCardBody
          lineKanaWord={lineKanaWord}
          typeResult={lineResult.typeResult}
          lineTypeWord={lineTypeWord}
          lostWord={lostWord!}
        />
      </CardBody>
      <CardFooter py={0} className="ml-1 font-semibold text-lg">
        <ResultCardFooter
          point={point!}
          tBonus={tBonus!}
          maxLinePoint={maxLinePoint}
          lMiss={lMiss!}
          kpm={kpm!}
          rkpm={rkpm!}
        />
      </CardFooter>
    </Card>
  );
};

export default PracticeLineCard;
