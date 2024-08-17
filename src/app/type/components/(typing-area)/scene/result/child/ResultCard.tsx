"use client";
import { inputModeAtom, mapAtom, sceneAtom, speedAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { CHAR_POINT } from "@/app/type/(ts)/scene-ts/ready/createTypingWord";
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
  useTheme,
} from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { memo } from "react";

interface ResultCardProps {
  lineResult: LineResultData;
  index: number;
  lineCount: number;
  lineData: LineData;
  cardRefs: React.RefObject<HTMLDivElement[]>;
  lineSelectIndex: number | null;
  handleCardClick: (seekTime: number, index: number) => void;
}

function ResultCard({
  lineResult,
  index,
  lineCount,
  lineData,
  cardRefs,
  lineSelectIndex,
  handleCardClick,
}: ResultCardProps) {
  const map = useAtomValue(mapAtom);
  const inputMode = useAtomValue(inputModeAtom);
  const scene = useAtomValue(sceneAtom);
  const speedData = useAtomValue(speedAtom);
  const theme = useTheme();

  const lineInputMode = lineResult.status?.mode ?? inputMode;
  const lineKanaWord = lineData.word.map((w) => w["k"]).join("");
  const lineTypeWord =
    lineInputMode === "roma" ? lineData.word.map((w) => w["r"][0]).join("") : lineKanaWord;
  const lineNotes = lineInputMode === "roma" ? lineData.notes.r : lineData.notes.k;
  const lineTime = Number(map!.mapData[index + 1].time) - (index === 0 ? 0 : Number(lineData.time));
  const lineKpm = lineInputMode === "roma" ? lineData.kpm.r : lineData.kpm.k;

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
      <CardHeader py={0}>
        <Box>
          <span data-list-number={index}>
            {lineCount}/{map!.lineLength}
          </span>{" "}
          (
          <Tooltip
            label={`ライン打鍵数${lineInputMode === "roma" ? "(ローマ字)" : "(かな)"}`}
            placement="top"
            fontSize="sm"
            bg={theme.colors.popup.bg}
            color={theme.colors.popup.color}
            border="1px solid"
            borderColor={theme.colors.type.card.borderColor}
          >
            <span className="line-notes">{lineNotes}打</span>
          </Tooltip>
          ÷{" "}
          <Tooltip
            label="ライン時間"
            placement="top"
            fontSize="sm"
            bg={theme.colors.popup.bg}
            color={theme.colors.popup.color}
            border="1px solid"
            borderColor={theme.colors.type.card.borderColor}
          >
            <span className="line-time">{lineTime.toFixed(1)}秒</span>
          </Tooltip>
          ={" "}
          <Tooltip
            label={`要求打鍵速度${lineInputMode === "roma" ? "(ローマ字)" : "(かな)"}`}
            placement="top"
            fontSize="sm"
            bg={theme.colors.popup.bg}
            color={theme.colors.popup.color}
            border="1px solid"
            borderColor={theme.colors.type.card.borderColor}
          >
            <span className="line-kpm">{lineKpm}kpm</span>
          </Tooltip>
          )
        </Box>
      </CardHeader>
      <CardBody py={0} className="text-md word-font">
        <Box className="kana-word">
          <Box>{lineKanaWord}</Box>
        </Box>
        <Box className="word-result outline-text text-white uppercase ml-1" letterSpacing="0.1em">
          {lineResult.typeResult?.map(
            (type: TypeResult, index: number) =>
              type.c && (
                <Tooltip
                  key={index}
                  label={`time: ${type.t.toFixed(3)}`}
                  placement="top"
                  fontSize="sm"
                  hasArrow
                  bg={theme.colors.popup.bg}
                  color={theme.colors.popup.color}
                  border="1px solid"
                  borderColor={theme.colors.type.card.borderColor}
                  css={{
                    "--popper-arrow-bg": theme.colors.popup.bg,
                    "--popper-arrow-shadow-color": theme.colors.type.card.borderColor,
                  }}
                >
                  <Text
                    as="span"
                    _hover={{ bg: "gray.300" }}
                    color={
                      type.is
                        ? lostWord === ""
                          ? theme.colors.type.word.completed
                          : theme.colors.type.word.correct
                        : theme.colors.type.word.error
                    }
                  >
                    {type.c.replace(/ /g, "ˍ")}
                  </Text>
                </Tooltip>
              ),
          )}
          <Text as="span" wordBreak="break-all">
            {lostWord !== null ? lostWord : lineTypeWord}
          </Text>
        </Box>
      </CardBody>
      <CardFooter py={0} className="ml-1 font-semibold text-lg">
        <Stack>
          <Box>
            miss:{lMiss},{" "}
            <Tooltip
              label={`rkpm:${rkpm}`}
              placement="top"
              fontSize="sm"
              bg={theme.colors.popup.bg}
              color={theme.colors.popup.color}
              border="1px solid"
              borderColor={theme.colors.type.card.borderColor}
            >
              <Text as="span">
                kpm:
                {kpm}
              </Text>
            </Tooltip>
            ,{" "}
            <Tooltip
              label={`Point: ${point}, Bonus:${tBonus} = ${Number(point) + Number(tBonus)}`}
              placement="top"
              fontSize="sm"
              bg={theme.colors.popup.bg}
              color={theme.colors.popup.color}
              border="1px solid"
              borderColor={theme.colors.type.card.borderColor}
            >
              <Text as="span">
                point:{point}
                {tBonus ? `+${tBonus}` : ""}/{maxLinePoint}
              </Text>
            </Tooltip>
          </Box>
        </Stack>
      </CardFooter>
    </Card>
  );
}

export default memo(ResultCard);
