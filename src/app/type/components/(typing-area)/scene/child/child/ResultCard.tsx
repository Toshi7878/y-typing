"use client";
import { inputModeAtom, mapAtom, sceneAtom, speedAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { useRefs } from "@/app/type/(contexts)/refsProvider";
import { CHAR_POINT } from "@/app/type/(ts)/createTypingWord";
import { LineData, LineResultData, TypeResult } from "@/app/type/(ts)/type";
import {
  Box,
  Text,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Tooltip,
  Stack,
} from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";
import { memo } from "react";

interface ResultCardProps {
  lineResult: LineResultData;
  index: number;
  lineCount: number;
  lineData: LineData;
  cardRefs: React.RefObject<HTMLDivElement[]>;
  lineSelectIndex: number;
  handleCardClick: (lineNumber: number, seekTime: number, index: number) => void;
  handleCardHover: (lineNumber: number) => void;
}

function ResultCard({
  lineResult,
  index,
  lineCount,
  lineData,
  cardRefs,
  lineSelectIndex,
  handleCardClick,
  handleCardHover,
}: ResultCardProps) {
  const map = useAtomValue(mapAtom);
  const inputMode = useAtomValue(inputModeAtom);
  const scene = useAtomValue(sceneAtom);
  const speedData = useAtomValue(speedAtom);

  const lineInputMode = lineResult.status?.mode ?? inputMode;
  const lineKanaWord = lineData.word.map((w) => w["k"]).join("");
  const lineTypeWord =
    lineInputMode === "roma" ? lineData.word.map((w) => w["r"][0]).join("") : lineKanaWord;
  const lineNotes = lineInputMode === "roma" ? lineData.notes.r : lineData.notes.k;
  const lineTime = Number(map!.words[index + 1].time) - (index === 0 ? 0 : Number(lineData.time));
  const lineKpm = lineInputMode === "roma" ? lineData.kpm.r : lineData.kpm.k;

  const maxLinePoint = lineData.notes.r * CHAR_POINT;

  const kpm = lineResult.status?.lKpm;
  const rkpm = lineResult.status?.lRkpm;
  const point = lineResult.status?.p;
  const lMiss = lineResult.status?.lMiss;
  const tBonus = lineResult.status?.tBonus;

  const seekTime =
    Number(map!.mapData[index]["time"]) - (scene === "replay" ? 0 : 1 / speedData.playSpeed);

  const lineNumber = lineCount;

  return (
    <Card
      key={index}
      p={4}
      mb={4}
      ref={(el) => {
        if (el) cardRefs.current![index] = el;
      }}
      data-seek-time={seekTime}
      data-line-number={lineNumber}
      data-count={index}
      size={"sm"}
      boxShadow="md"
      cursor="pointer"
      bg={lineSelectIndex === lineCount ? "gray.400" : ""}
      onMouseEnter={() => handleCardHover(lineNumber)}
      onClick={() => handleCardClick(lineNumber, seekTime, index)}
    >
      <CardHeader py={1}>
        <Box>
          <span data-list-number={index}>
            {lineCount}/{map!.lineLength}
          </span>{" "}
          (
          <Tooltip
            label={`ライン打鍵数${lineInputMode === "roma" ? "(ローマ字)" : "(かな)"}`}
            placement="top"
            fontSize="sm"
          >
            <span className="line-notes">{lineNotes}打</span>
          </Tooltip>
          ÷{" "}
          <Tooltip label="ライン時間" placement="top" fontSize="sm">
            <span className="line-time">{lineTime.toFixed(1)}秒</span>
          </Tooltip>
          ={" "}
          <Tooltip
            label={`要求打鍵速度${lineInputMode === "roma" ? "(ローマ字)" : "(かな)"}`}
            placement="top"
            fontSize="sm"
          >
            <span className="line-kpm">{lineKpm}kpm</span>
          </Tooltip>
          )
        </Box>
      </CardHeader>
      <CardBody py={1} className="text-xl word-font">
        <Box className="kana-word">
          <Box>{lineKanaWord}</Box>
        </Box>
        <Box className="word-result  outline-text text-white uppercase ml-1">
          {lineResult.typeResult?.map(
            (type: TypeResult, index: number) =>
              type.c && (
                <Tooltip
                  key={index}
                  label={`time: ${type.t.toFixed(3)}`}
                  placement="top"
                  fontSize="sm"
                  hasArrow
                  border="1px solid white"
                  css={{
                    "--popper-arrow-bg": "var(--chakra-colors-gray-700)",
                    "--popper-arrow-shadow-color": "white",
                  }}
                >
                  <Text
                    as="span"
                    _hover={{ bg: "gray.300" }}
                    color={type.is ? "teal.500" : "red.500"}
                  >
                    {type.c.replace(/ /g, "ˍ")}
                  </Text>
                </Tooltip>
              ),
          )}
          <Text as="span" wordBreak="break-all">
            {lineResult.status?.lostW !== null ? lineResult.status?.lostW : lineTypeWord}
          </Text>
        </Box>
      </CardBody>
      <CardFooter py={1} className="ml-1 font-bold font-mono text-xl">
        <Stack>
          <Box>
            <Tooltip label={`rkpm:${rkpm}`} placement="top" fontSize="sm">
              <span>kpm:{kpm}</span>
            </Tooltip>
            , miss:{lMiss}, point:{point}
            {tBonus ? `+${tBonus}` : ""}/{maxLinePoint}
          </Box>
        </Stack>
      </CardFooter>
    </Card>
  );
}

export default memo(ResultCard);
