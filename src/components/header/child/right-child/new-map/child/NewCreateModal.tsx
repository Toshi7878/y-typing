"use client";

import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Box,
  useTheme,
  Flex,
  UseDisclosureReturn,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { IndexDBOption, ThemeColors } from "@/types";
import CustomToolTip from "@/components/CustomToolTip";
import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { EditorNewMapBackUpInfoData } from "@/app/edit/ts/type";
import { Link } from "@chakra-ui/next-js";
import { useLinkClick } from "@/lib/hooks/useLinkClick";
import NProgress from "nprogress";
import { extractYouTubeVideoId } from "../extractYTId";
import CustomModalContent from "@/components/CustomModalContent";

interface NewCreateModalProps {
  newCreateModalDisclosure: UseDisclosureReturn;
}

const BACKUP_OVERWRITE_WARNING =
  "新規作成すると前回のバックアップデータが失われますがよろしいですか？";

export default function NewCreateModal({ newCreateModalDisclosure }: NewCreateModalProps) {
  const router = useRouter();
  const theme: ThemeColors = useTheme();
  const [backupTitle, setBackupTitle] = useState({ title: "", videoId: "" });
  const [createYTURL, setCreateYTURL] = useState("");
  const [newID, setNewID] = useState("");
  const handleLinkClick = useLinkClick();

  const newCreate = (event) => {
    event.preventDefault(); // ページ遷移を無効にする
    const NEW_ID = extractYouTubeVideoId(createYTURL);
    if (NEW_ID && NEW_ID.length == 11) {
      const shouldOverwriteBackup = backupTitle.videoId ? confirm(BACKUP_OVERWRITE_WARNING) : true;

      if (shouldOverwriteBackup) {
        NProgress.configure({ showSpinner: false });
        NProgress.configure({ trickle: false });
        NProgress.start();
        router.push(`/edit?new=${NEW_ID}`);
        newCreateModalDisclosure.onClose();
      }
    }
  };

  useEffect(() => {
    db.editorNewCreateBak
      .get({ optionName: "backupMapInfo" })
      .then((data: IndexDBOption | undefined) => {
        if (data) {
          const backupMapInfo = data.value as EditorNewMapBackUpInfoData;
          setBackupTitle({ title: backupMapInfo.title, videoId: backupMapInfo.videoId });
        } else {
          setBackupTitle({ title: "", videoId: "" });
        }
      });

    return () => {
      setBackupTitle({ title: "", videoId: "" });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal isOpen={newCreateModalDisclosure.isOpen} onClose={newCreateModalDisclosure.onClose}>
      <ModalOverlay />
      <CustomModalContent>
        <ModalHeader>譜面新規作成ウィンドウ</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          譜面を作成したいYouTube動画のURLを入力
          <form onSubmit={newCreate}>
            <Input
              value={createYTURL}
              placeholder="YouTube URLを入力"
              onChange={(event) => {
                setCreateYTURL(event.target.value);
                setNewID(extractYouTubeVideoId(event.target.value));
              }}
            />
          </form>
        </ModalBody>

        <ModalFooter>
          <Flex justify="space-between" align="center" w="100%">
            <CustomToolTip
              tooltipLabel={
                <Box>
                  <Box>タイトル: {backupTitle.title}</Box>
                  <Box>YouTubeId: {backupTitle.videoId}</Box>
                </Box>
              }
              placement="top"
              fontSize="sm"
              isDisabled={backupTitle.title ? false : true}
            >
              <Link
                fontSize="sm"
                href={`/edit?new=${backupTitle.videoId}&backup=true`}
                onClick={(event) => {
                  handleLinkClick(event);
                  newCreateModalDisclosure.onClose();
                }}
                visibility={backupTitle.videoId ? "visible" : "hidden"}
              >
                <Button
                  variant="outline"
                  size="xs"
                  p={4}
                  color={`${theme.colors.card.color}ff`}
                  borderColor={`${theme.colors.card.borderColor}50`}
                >
                  前回のバックアップデータが存在します。
                </Button>
              </Link>
            </CustomToolTip>
            <Link
              href={`/edit?new=${newID}`}
              onClick={(event) => {
                const shouldOverwriteBackup = backupTitle.videoId
                  ? confirm(BACKUP_OVERWRITE_WARNING)
                  : true;

                if (shouldOverwriteBackup) {
                  handleLinkClick(event);
                  newCreateModalDisclosure.onClose();
                } else {
                  event.preventDefault();
                }
              }}
            >
              <Button colorScheme="blue" isDisabled={!newID}>
                新規作成
              </Button>
            </Link>
          </Flex>
        </ModalFooter>
      </CustomModalContent>
    </Modal>
  );
}
