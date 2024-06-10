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
} from "@chakra-ui/react";

import { useForm } from "react-hook-form";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import { useDispatch } from "react-redux";
import { allAdjustTime } from "../../(redux)/mapDataSlice";

export default forwardRef(function EditorSettingModal(props, ref) {
  const { getAll, update } = useIndexedDB("editorOption");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();

  const [optionsData, setOptionsData] = useState<{ optionName: string; value: string }[]>([]);
  const [selectedConvertOption, setSelectedConvertOption] = useState("");

  useEffect(() => {
    getAll().then((allData) => {
      const formattedData = allData.reduce((acc, { optionName, value }) => {
        acc[optionName] = value;
        return acc;
      }, {});
      setOptionsData(formattedData);
      setSelectedConvertOption(formattedData["word-convert-option"] ?? "non_symbol");
      methods.reset({
        time_offset: formattedData["time_offset"] ?? -1.6,
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
    getTimeOffset: () => Number(methods.getValues("time_offset")),
    getWordConvertOption: () => selectedConvertOption,
  }));

  const sendIndexedDB = (target: HTMLInputElement) => {
    update({ optionName: target.name, value: target.value });
  };

  const allTimeAdjust = () => {
    const adjustTime = Number(methods.getValues("all_time_adjust"));

    if (confirm(`全体のタイムを ${adjustTime} ずつ調整しますか？`))
      dispatch(allAdjustTime(adjustTime));
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
                <form onChange={(e) => sendIndexedDB(e.target as HTMLInputElement)}>
                  <VStack align="start" spacing={4}>
                    <FormControl>
                      <HStack alignItems="baseline">
                        <FormLabel fontSize="sm">追加タイム調整</FormLabel>

                        <Input
                          {...register("time_offset", {
                            value: optionsData["time_offset"] ?? -1.6,
                          })}
                          name="time-offset"
                          placeholder=""
                          type="number"
                          size="md"
                          step="0.05"
                          min="-3"
                          max="3"
                          className="max-w-[70px]"
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
                          {...register("all_time_adjust")}
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

                        <Slider w="200px" aria-label="slider-ex-1" defaultValue={30}>
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>

                          <SliderThumb />
                        </Slider>
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
