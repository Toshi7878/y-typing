"use client";
import { inputModeAtom, mapAtom } from "@/app/type/(atoms)/gameRenderAtoms";
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
import { useAtom } from "jotai";
import { memo } from "react";

interface LineResultListProps {
  typingLineResults?: LineResultData[];
}

function LineResultList({ typingLineResults }: LineResultListProps) {
  const [map] = useAtom(mapAtom);
  const [inputMode] = useAtom(inputModeAtom);
  const { playerRef } = useRefs();
  let lineCount = 0;
  return (
    <>
      {map!.words.map((line: LineData, index: number) => {
        if (!map?.words[index].notes.k) {
          return null;
        }

        lineCount++;
        const lineResult = typingLineResults?.[index];

        const lineInputMode = lineResult?.status?.mode ?? inputMode;
        const lineKanaWord = line.word.map((w) => w["k"]).join("");
        const lineTypeWord =
          lineInputMode === "roma" ? line.word.map((w) => w["r"][0]).join("") : lineKanaWord;
        const lineNotes = lineInputMode === "roma" ? line.notes.r : line.notes.k;
        const lineTime = Number(map!.words[index + 1].time) - (index === 0 ? 0 : Number(line.time));
        const lineKpm = lineInputMode === "roma" ? line.kpm.r : line.kpm.k;

        const maxLinePoint = line.notes.r * CHAR_POINT;

        const kpm = lineResult?.status?.lKpm ?? 0;
        const rkpm = lineResult?.status?.lRkpm ?? 0;
        const point = lineResult?.status?.p ?? 0;
        const lMiss = lineResult?.status?.lMiss ?? 0;
        const tBonus = lineResult?.status?.tBonus ?? 0;
        return (
          <Card
            key={index}
            p={4}
            mb={4}
            boxShadow="sm"
            cursor="pointer"
            backgroundColor="rgba(255, 255, 255, 0.7)"
            _hover={{ boxShadow: "md", bg: "gray.100" }}
            onClick={() => playerRef.current.seekTo(map!.mapData[index]["time"])}
          >
            <CardHeader py={1}>
              <Box>
                <span data-list-number={index}>
                  {lineCount}/{map.lineLength}
                </span>{" "}
                (
                <Tooltip label="ライン打鍵数" placement="top" fontSize="sm">
                  <span className="line-notes">{lineNotes}打</span>
                </Tooltip>
                ÷{" "}
                <Tooltip label="ライン時間" placement="top" fontSize="sm">
                  <span className="line-time">{lineTime.toFixed(1)}秒</span>
                </Tooltip>
                ={" "}
                <Tooltip label="要求打鍵速度" placement="top" fontSize="sm">
                  <span className="line-kpm">{lineKpm}kpm</span>
                </Tooltip>
                )
              </Box>
            </CardHeader>
            <CardBody py={1} className="text-xl word-font">
              <Box className="kana-word ">
                <Box>{lineKanaWord}</Box>
              </Box>
              <Box className="word-result  outline-text text-white uppercase ml-1">
                {lineResult?.typeResult?.map(
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
                {lineResult ? lineResult.status?.lostW : lineTypeWord}
              </Box>
            </CardBody>
            <CardFooter py={1} className="ml-1 font-bold font-mono text-xl">
              <Stack>
                <Box>
                  kpm:{kpm}, rkpm:{rkpm}, miss:{lMiss}, point:{point}
                  {tBonus ? `+${tBonus}` : ""}/{maxLinePoint}
                </Box>
              </Stack>
            </CardFooter>
          </Card>
        );
      })}
    </>
  );
}

export default memo(LineResultList);
