"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  Input,
  HStack,
  RadioGroup,
  Stack,
  VStack,
  ModalFooter,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useToast,
} from "@chakra-ui/react";

import { Controller, useForm } from "react-hook-form";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allAdjustTime } from "../../(redux)/mapDataSlice";
import { db, EditorOption } from "@/lib/db";
import { RootState } from "../../(redux)/store";
import { addHistory } from "../../(redux)/undoredoSlice";
import { useRefs } from "../../(contexts)/refsProvider";
import { setCanUpload } from "../../(redux)/buttonFlagsSlice";

export default forwardRef(function EditorSettingModal(props, ref) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const toast = useToast();

  const [optionsData, setOptionsData] = useState<EditorOption>();
  const [selectedConvertOption, setSelectedConvertOption] = useState("");
  const mapData = useSelector((state: RootState) => state.mapData.value);
  const { playerRef } = useRefs();

  const DEFAULT_ADJUST_TIME = -0.16;
  const DEFAULT_VOLUME = 50;
  useEffect(() => {
    db.editorOption.toArray().then((allData) => {
      const formattedData = allData.reduce((acc, { optionName, value }) => {
        acc[optionName] = value;
        return acc;
      }, {} as EditorOption);
      setOptionsData(formattedData);
      setSelectedConvertOption(formattedData["word-convert-option"] ?? "non_symbol");
      methods.reset({
        "time-offset": formattedData["time-offset"] ?? DEFAULT_ADJUST_TIME,
        "volume-range": formattedData["volume-range"] ?? DEFAULT_VOLUME,
      });
    });
  }, []);

  const methods = useForm();
  const { register } = methods;

  const options = [
    { colorScheme: "green", label: "記号なし(一部除く)", value: "non_symbol" },

    { colorScheme: "yellow", label: "記号あり(一部)", value: "add_symbol" },

    { colorScheme: "red", label: "記号あり(すべて)", value: "add_symbol_all" },
  ];

  useImperativeHandle(ref, () => ({
    getTimeOffset: () => Number(methods.getValues("time-offset")),
    getWordConvertOption: () => selectedConvertOption,
    getVolume: () => Number(methods.getValues("volume-range")),
  }));

  const sendIndexedDB = async (target: HTMLInputElement) => {
    db.editorOption.put({ optionName: target.name, value: target.value });
  };

  const allTimeAdjust = () => {
    const adjustTime = Number(methods.getValues("all-time-adjust"));

    if (!adjustTime) {
      return;
    }

    const times = mapData.map((item) => item.time);
    dispatch(setCanUpload(true));

    dispatch(addHistory({ type: "allAdjustTime", data: { times, adjustTime } }));
    dispatch(allAdjustTime(adjustTime));
    toast({
      title: "タイムを調整しました",
      description: (
        <small>
          全体のタイムが{adjustTime}秒調整されました。
          <br />
          Ctrl + Zで前のタイムに戻ることができます。
        </small>
      ),
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom-right",
      containerStyle: {
        border: "1px solid",

        borderColor: "gray.200",
        fontSize: "lg", // サイズを大きくする
      },
    });
  };

  return (
    <>
      <Button
        variant="outline"
        size="xs"
        width="35px"
        height="30px"
        colorScheme=""
        _hover={{ bg: "#ebdf92bb" }}
        onClick={onOpen}
      >
        設定
      </Button>

      {isOpen && (
        <div id="modal-root">
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent maxW="600px">
              <ModalHeader>エディター設定</ModalHeader>

              <ModalCloseButton />

              <ModalBody>
                <form>
                  <VStack align="start" spacing={4}>
                    <FormControl>
                      <HStack alignItems="baseline">
                        <FormLabel fontSize="sm">追加タイム調整</FormLabel>

                        <Input
                          {...register("time-offset", {
                            value: optionsData?.["time-offset"] ?? DEFAULT_ADJUST_TIME,
                          })}
                          name="time-offset"
                          placeholder=""
                          type="number"
                          size="md"
                          step="0.05"
                          min="-3"
                          max="3"
                          className="max-w-[70px]"
                          onChange={(e) => sendIndexedDB(e.target as HTMLInputElement)}
                        />

                        <FormLabel fontSize="xs" color="gray.500">
                          追加ボタンを押した時に、数値分のタイムを調整します
                        </FormLabel>
                      </HStack>
                    </FormControl>

                    <FormControl>
                      <HStack alignItems="baseline">
                        <FormLabel fontSize="sm">全体タイム調整</FormLabel>

                        <Input
                          {...register("all-time-adjust")}
                          placeholder=""
                          type="number"
                          size="md"
                          step="0.05"
                          min="-3"
                          max="3"
                          className="max-w-[70px]"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              allTimeAdjust();
                            }
                          }}
                        />

                        <Button colorScheme="yellow" variant={"outline"} onClick={allTimeAdjust}>
                          実行
                        </Button>
                        <FormLabel fontSize="xs" color="gray.500">
                          実行ボタンを押すと、全体のタイムが増減します
                        </FormLabel>
                      </HStack>
                    </FormControl>

                    <FormControl>
                      <HStack alignItems="center">
                        <FormLabel fontSize="sm">音量</FormLabel>

                        <Controller
                          name="volume-range"
                          control={methods.control}
                          defaultValue={DEFAULT_VOLUME}
                          render={({ field }) => (
                            <Slider
                              w="200px"
                              aria-label="slider-ex-1"
                              {...field}
                              onChange={(value) => {
                                field.onChange(value);
                                playerRef.current.setVolume(value);
                                db.editorOption.put({ optionName: "volume-range", value });
                              }}
                            >
                              <SliderTrack>
                                <SliderFilledTrack />
                              </SliderTrack>
                              <SliderThumb />
                            </Slider>
                          )}
                        />
                      </HStack>
                    </FormControl>

                    <FormControl mt={4}>
                      <HStack alignItems="baseline">
                        <FormLabel fontSize="sm">読み変換</FormLabel>

                        <RadioGroup
                          onChange={setSelectedConvertOption}
                          value={selectedConvertOption}
                        >
                          <Stack direction="row">
                            {options.map((option) => (
                              <Button
                                key={option.label}
                                variant={
                                  selectedConvertOption === option.value ? "solid" : "outline"
                                }
                                size="sm"
                                width="150px"
                                height="50px"
                                name="word-convert-option"
                                colorScheme={option.colorScheme}
                                value={option.value}
                                onClick={(e) => {
                                  setSelectedConvertOption(option.value);
                                  sendIndexedDB(e.target as HTMLInputElement);
                                }}
                              >
                                {option.label}
                              </Button>
                            ))}
                          </Stack>
                        </RadioGroup>
                      </HStack>
                    </FormControl>
                  </VStack>
                </form>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      )}
    </>
  );
});
