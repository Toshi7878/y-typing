"use client";
import { inputModeAtom, mapAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { CHAR_POINT } from "@/app/type/(ts)/createTypingWord";
import { LineData, LineResultData, TypeResult } from "@/app/type/(ts)/type";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Box,
  Text,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Tooltip,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { memo } from "react";

interface EndTypingResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  typingLineResults?: LineResultData[];
}

function EndTypingResultModal({ isOpen, onClose, typingLineResults }: EndTypingResultModalProps) {
  const [map] = useAtom(mapAtom);
  const [inputMode] = useAtom(inputModeAtom);
  console.log("modal Open");
  let lineCount = 0;
  return (
    <Modal isOpen={isOpen} isCentered onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="60%">
        <ModalHeader>タイピングリザルト</ModalHeader>

        <ModalCloseButton />
        <ModalBody>
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
            const lineTime =
              Number(map!.words[index + 1].time) - (index === 0 ? 0 : Number(line.time));
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
                _hover={{ boxShadow: "md", bg: "gray.100" }}
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
                <CardBody py={1} className="text-3xl word-font">
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
                <CardFooter py={1} className="ml-1">
                  <Box className="line-status-result font-bold font-mono text-xl">
                    kpm: {kpm}, rkpm: {rkpm}, miss:
                    {lMiss}, point: {point}
                    {tBonus ? `+${tBonus}` : ""} / {maxLinePoint}
                  </Box>
                </CardFooter>
              </Card>
            );
          })}
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default memo(EndTypingResultModal);
