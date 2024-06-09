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

import { useState } from "react";

export default function EditorSettingModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { register } = useForm();

  const [selectedOption, setSelectedOption] = useState("記号なし(一部除く)");

  const options = [
    { colorScheme: "green", label: "記号なし(一部除く)", value: "non_symbol" },

    { colorScheme: "yellow", label: "記号あり(一部)", value: "add_symbol" },

    { colorScheme: "red", label: "記号あり(すべて)", value: "add_symbol_all" },
  ];

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
                          {...register("time", { value: -1.6 })}
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
                        />

                        <Button colorScheme="yellow" variant={"outline"}>
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

                        <RadioGroup onChange={setSelectedOption} value={selectedOption}>
                          <Stack direction="row">
                            {options.map((option) => (
                              <Button
                                key={option.label}
                                variant={selectedOption === option.label ? "solid" : "outline"}
                                size="sm"
                                width="150px"
                                height="50px"
                                colorScheme={option.colorScheme}
                                onClick={() => setSelectedOption(option.label)}
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
}
