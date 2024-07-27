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
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { memo } from "react";

function EndTypingResultModal({ isOpen, onClose }) {
  const { statusRef } = useRefs();
  const [map] = useAtom(mapAtom);
  console.log("modal Open");

  return (
    <Modal isOpen={isOpen} isCentered onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="60%">
        <ModalHeader>タイピングリザルト</ModalHeader>

        <ModalCloseButton />
        <ModalBody>
          {statusRef.current!.status.result.map((lineResult: LineResultObj, index) => {
            if (!map?.words[index].notes.k) {
              return null;
            }

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

            return (
              <Card key={index} p={4} mb={4} boxShadow="sm">
                <CardHeader py={1}>
                  <Box>
                    <span data-list-number={index}>{index}</span> (
                    <span title="ライン打鍵数">{lineNotes}</span>打 ÷{" "}
                    <span title="ライン時間">{lineTime.toFixed(1)}</span>秒 ={" "}
                    <span title="要求打鍵速度">{lineKpm}</span>kpm)
                  </Box>
                </CardHeader>
                <CardBody py={1} className="text-2xl word-font">
                  <Box className="kana-word ">
                    <Box>{lineKanaWord}</Box>
                  </Box>
                  <Box className="word-result  outline-text text-white uppercase ml-1">
                    {lineResult.typeResult.map(
                      (type, index) =>
                        type.c && (
                          <Text as="span" key={index} color={type.is ? "teal.500" : "red.500"}>
                            {type.c}
                          </Text>
                        ),
                    )}
                    {lineResult.status.lostW}
                  </Box>
                </CardBody>
                <CardFooter py={1} className="ml-1">
                  <Box className="line-status-result font-bold font-mono text-xl">
                    kpm: {lineResult.status.lKpm}, rkpm: {lineResult.status.lRkpm}, miss:
                    {lineResult.status.miss}, point: {lineResult.status.p} / {maxLinePoint},
                    timeBonus:+{lineResult.status.tBonus}
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
