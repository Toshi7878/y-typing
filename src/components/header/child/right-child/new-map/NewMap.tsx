"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  Box,
  useTheme,
} from "@chakra-ui/react";
import { MdAddBox } from "react-icons/md";
import { extractYouTubeVideoId } from "./extractYTId";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import { ThemeColors } from "@/types";

const schema = z.object({
  URL: z
    .string()
    .url()
    .refine((url) => extractYouTubeVideoId(url)),
});

export default function NewMap() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const theme: ThemeColors = useTheme();

  const methods = useForm({
    resolver: zodResolver(schema),
  });
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = methods;

  const newCreate = (data) => {
    const ID = extractYouTubeVideoId(data.URL);
    if (ID && ID.length == 11 && isValid) {
      NProgress.configure({ showSpinner: false });
      NProgress.configure({ trickle: false });

      NProgress.start();
      router.push(`/edit?new=${ID}`);
      onClose();
    }
  };

  return (
    <>
      <Box
        color={theme.colors.header.color}
        _hover={{
          color: theme.colors.header.hover.color,
        }}
        className="cursor-pointer text-xl"
        onClick={onOpen}
      >
        <MdAddBox />
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={"popup.bg"} color={"popup.color"}>
          <ModalHeader>譜面新規作成ウィンドウ</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            譜面を作成したいYouTube動画のURLを入力
            <form onSubmit={handleSubmit(newCreate)}>
              <Input placeholder="YouTube URLを入力" {...register("URL")} />
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit(newCreate)} isDisabled={!isValid}>
              新規作成
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}