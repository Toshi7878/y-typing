"use client";
import { mapAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { useRefs } from "@/app/type/(contexts)/refsProvider";
import { CHAR_POINT } from "@/app/type/(ts)/createTypingWord";
import { LineResultObj } from "@/app/type/(ts)/type";
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

function EndTypingResultModal({ isOpen, onClose, typingLineResults }) {
  const [map] = useAtom(mapAtom);
  console.log("modal Open");
  let lineCount = 0;
  return (
    <Modal isOpen={isOpen} isCentered onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="60%">
        <ModalHeader>タイピングリザルト</ModalHeader>

        <ModalCloseButton />
        <ModalBody>
          {typingLineResults.map((lineResult: LineResultObj, index) => {
            if (!map?.words[index].notes.k) {
              return null;
            }

            lineCount++;
            const inputMode = lineResult.status.mode;
            const lineKanaWord = map!.words[index].word.map((w) => w["k"]).join("");
            const lineNotes =
              inputMode === "roma" ? map!.words[index].notes.r : map!.words[index].notes.k;
            const lineTime =
              Number(map!.words[index + 1].time) -
              (index === 0 ? 0 : Number(map!.words[index].time));
            const lineKpm =
              inputMode === "roma" ? map!.words[index].kpm.r : map!.words[index].kpm.k;

            const maxLinePoint = map!.words[index].notes.r * CHAR_POINT;

            const tBonus = lineResult.status.tBonus;
            return (
              <Card key={index} p={4} mb={4} boxShadow="sm">
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
                    {lineResult.typeResult.map(
                      (type, index) =>
                        type.c && (
                          <Tooltip
                            key={index}
                            label={`time: ${type.t}`}
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
                    {lineResult.status.lostW}
                  </Box>
                </CardBody>
                <CardFooter py={1} className="ml-1">
                  <Box className="line-status-result font-bold font-mono text-xl">
                    kpm: {lineResult.status.lKpm}, rkpm: {lineResult.status.lRkpm}, miss:
                    {lineResult.status.lMiss}, point: {lineResult.status.p}
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
