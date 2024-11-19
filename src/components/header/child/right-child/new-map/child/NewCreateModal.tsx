"use client";

import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  UseDisclosureReturn,
  Box,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { IndexDBOption } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { db } from "@/lib/db";
import { EditorNewMapBackUpInfoData } from "@/app/edit/ts/type";
import NProgress from "nprogress";
import { extractYouTubeVideoId } from "../extractYTId";
import CustomModalContent from "@/components/custom-chakra-ui/CustomModalContent";
import CreateMapBackUpButton from "./child/CreateMapBackUpButton";
import NewCreateButton from "./child/NewCreateButton";
import NewCreateVideoIdInputBox from "./child/NewCreateVideoIdInputBox";
import CreatedCheck from "./child/CreatedCheck";

interface NewCreateModalProps {
  newCreateModalDisclosure: UseDisclosureReturn;
}

const BACKUP_OVERWRITE_WARNING =
  "新規作成すると前回のバックアップデータが失われますがよろしいですか？";

export default function NewCreateModal({ newCreateModalDisclosure }: NewCreateModalProps) {
  const router = useRouter();
  const [createMapBackUpInfo, setCreateMapBackUpInfo] = useState({ title: "", videoId: "" });
  const [createYTURL, setCreateYTURL] = useState("");
  const [newID, setNewID] = useState("");
  const createBtnRef = useRef(null);

  const newCreate = useCallback(
    (event) => {
      event.preventDefault(); // ページ遷移を無効にする
      const NEW_ID = extractYouTubeVideoId(createYTURL);
      if (NEW_ID && NEW_ID.length == 11) {
        const shouldOverwriteBackup = createMapBackUpInfo.videoId
          ? confirm(BACKUP_OVERWRITE_WARNING)
          : true;

        if (shouldOverwriteBackup) {
          NProgress.configure({ showSpinner: false });
          NProgress.configure({ trickle: false });
          NProgress.start();
          router.push(`/edit?new=${NEW_ID}`);
          newCreateModalDisclosure.onClose();
        }
      }
    },
    [createYTURL, createMapBackUpInfo],
  );

  useEffect(() => {
    db.editorNewCreateBak
      .get({ optionName: "backupMapInfo" })
      .then((data: IndexDBOption | undefined) => {
        if (data) {
          const backupMapInfo = data.value as EditorNewMapBackUpInfoData;
          setCreateMapBackUpInfo({ title: backupMapInfo.title, videoId: backupMapInfo.videoId });
        } else {
          setCreateMapBackUpInfo({ title: "", videoId: "" });
        }
      });

    return () => {
      setCreateMapBackUpInfo({ title: "", videoId: "" });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal isOpen={newCreateModalDisclosure.isOpen} onClose={newCreateModalDisclosure.onClose}>
      <ModalOverlay />
      <CustomModalContent maxW="640px">
        <ModalHeader>譜面新規作成ウィンドウ</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <NewCreateVideoIdInputBox
            newCreateModalDisclosure={newCreateModalDisclosure}
            createBtnRef={createBtnRef}
            createYTURL={createYTURL}
            setCreateYTURL={setCreateYTURL}
            setNewID={setNewID}
          />
        </ModalBody>

        <ModalFooter>
          <Flex direction="column" justify="space-between" align="center" w="100%" minH={"100px"}>
            <Flex justify="space-between" align="center" w="100%">
              <CreateMapBackUpButton
                createMapBackUpInfo={createMapBackUpInfo}
                newCreateModalDisclosure={newCreateModalDisclosure}
              />
              <NewCreateButton
                createMapBackUpInfo={createMapBackUpInfo}
                newCreateModalDisclosure={newCreateModalDisclosure}
                newID={newID}
                createBtnRef={createBtnRef}
              />
            </Flex>
            {newID ? (
              <Flex>
                <CreatedCheck videoId={newID} />{" "}
              </Flex>
            ) : null}
          </Flex>
        </ModalFooter>
      </CustomModalContent>
    </Modal>
  );
}
