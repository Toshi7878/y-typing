"use client";
import {
  inputModeAtom,
  lineSelectIndexAtom,
  mapAtom,
  sceneAtom,
  speedAtom,
} from "@/app/type/(atoms)/gameRenderAtoms";
import { useRefs } from "@/app/type/(contexts)/refsProvider";
import { CHAR_POINT } from "@/app/type/(ts)/createTypingWord";
import { LineResultData, TypeResult } from "@/app/type/(ts)/type";
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
import { memo, useCallback, useEffect, useRef } from "react";

interface LineResultListProps {
  typingLineResults: LineResultData[];
}

function LineResultList({ typingLineResults }: LineResultListProps) {
  const [map] = useAtom(mapAtom);
  const [inputMode] = useAtom(inputModeAtom);
  const [scene] = useAtom(sceneAtom);
  const [speedData] = useAtom(speedAtom);
  const { playerRef, gameStateRef } = useRefs();

  const [lineSelectIndex, setLineSelectIndex] = useAtom(lineSelectIndexAtom);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  const scrollToCard = (newIndex: number) => {
    const card = cardRefs.current[newIndex];
    const scrollHeight = cardRefs.current[1].parentElement!.scrollHeight;

    if (card) {
      cardRefs.current[1].parentElement!.scrollTop =
        (scrollHeight * (newIndex - 3)) / map!.typingLineNumbers.length;
    }
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        setLineSelectIndex((prev) => {
          const newIndex = Math.max(1, prev - 1);
          return newIndex;
        });
      } else if (event.key === "ArrowDown") {
        setLineSelectIndex((prev) => {
          const newIndex = Math.min(prev + 1, map!.typingLineNumbers.length);
          return newIndex;
        });
      } else if (event.key === "Enter") {
        const card = cardRefs.current[lineSelectIndex + 1];
        if (card) {
          card.click();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map, lineSelectIndex],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    scrollToCard(lineSelectIndex); // 初期表示時にスクロール

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleKeyDown, lineSelectIndex]);
  let lineCount = 0;
  return (
    <>
      {typingLineResults.map((lineResult: LineResultData, index: number) => {
        const line = map!.words[index];

        if (!line.notes.k) {
          return null;
        }

        lineCount++;

        const lineInputMode = lineResult.status?.mode ?? inputMode;
        const lineKanaWord = line.word.map((w) => w["k"]).join("");
        const lineTypeWord =
          lineInputMode === "roma" ? line.word.map((w) => w["r"][0]).join("") : lineKanaWord;
        const lineNotes = lineInputMode === "roma" ? line.notes.r : line.notes.k;
        const lineTime = Number(map!.words[index + 1].time) - (index === 0 ? 0 : Number(line.time));
        const lineKpm = lineInputMode === "roma" ? line.kpm.r : line.kpm.k;

        const maxLinePoint = line.notes.r * CHAR_POINT;

        const kpm = lineResult.status?.lKpm;
        const rkpm = lineResult.status?.lRkpm;
        const point = lineResult.status?.p;
        const lMiss = lineResult.status?.lMiss;
        const tBonus = lineResult.status?.tBonus;

        const seekTime =
          Number(map!.mapData[index]["time"]) - (scene === "replay" ? 0 : 1 / speedData.playSpeed);

        return (
          <Card
            key={index}
            p={4}
            mb={4}
            ref={(el) => {
              if (el) cardRefs.current[index] = el;
            }}
            size={"sm"}
            boxShadow="sm"
            cursor="pointer"
            backgroundColor={
              lineSelectIndex === lineCount ? "gray.500" : "rgba(255, 255, 255, 0.7)"
            }
            _hover={{ boxShadow: "md", bg: "gray.100" }}
            onClick={() => {
              if (scene === "replay") {
                playerRef.current.seekTo(seekTime);
              } else {
                playerRef.current.seekTo(0 > seekTime ? 0 : seekTime);
                gameStateRef.current!.practice.setLineCount = index;
              }
            }}
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
      })}
    </>
  );
}

export default memo(LineResultList);
