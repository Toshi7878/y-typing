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
} from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";
import { extractYouTubeVideoId } from "./extractYTId";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";

const schema = z.object({
  URL: z
    .string()
    .url()
    .refine((url) => extractYouTubeVideoId(url)),
});

export default function NewMap() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

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
      <span className="p-1 bg-gray-300 rounded cursor-pointer" onClick={onOpen}>
        <IoMdAdd />
      </span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
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
