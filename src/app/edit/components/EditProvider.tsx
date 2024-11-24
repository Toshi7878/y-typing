"use client";
import React from "react";
import InfoTabProvider from "../edit-contexts/InfoTabProvider";
import { RefsProvider } from "../edit-contexts/refsProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import editStore from "../redux/store";
import { Provider as ReduxProvider } from "react-redux";
import { createStore, Provider as JotaiProvider } from "jotai";
import { GetInfoData } from "@/types/api";
import {
  editCreatorCommentAtom,
  editCreatorIdAtom,
  editMapArtistNameAtom,
  editMapTitleAtom,
  editMusicSourceAtom,
  editPreviewTimeInputAtom,
  editTagsAtom,
  editVideoIdAtom,
} from "../edit-atom/editAtom";
import { useSearchParams } from "next/navigation";
import { EditorNewMapBackUpInfoData } from "../ts/type";
import { IndexDBOption } from "@/types";
import { db } from "@/lib/db";
import { getGlobalAtomStore, previewVideoIdAtom } from "@/components/atom/globalAtoms";

const queryClient = new QueryClient();
const editAtomStore = createStore();

export const getEditAtomStore = () => editAtomStore;

interface EditProviderProps {
  mapInfo?: GetInfoData;
  children: React.ReactNode;
}

const EditProvider = ({ mapInfo, children }: EditProviderProps) => {
  const searchParams = useSearchParams();
  const newVideoId = searchParams.get("new") || "";
  const isBackUp = searchParams.get("backup") === "true";

  const globalAtomStore = getGlobalAtomStore();
  globalAtomStore.set(previewVideoIdAtom, null);

  if (mapInfo) {
    editAtomStore.set(editMapTitleAtom, mapInfo.title);
    editAtomStore.set(editMapArtistNameAtom, mapInfo.artistName);
    editAtomStore.set(editVideoIdAtom, mapInfo.videoId);
    editAtomStore.set(editCreatorIdAtom, mapInfo.creatorId);
    editAtomStore.set(editCreatorCommentAtom, mapInfo.creatorComment);
    editAtomStore.set(editMusicSourceAtom, mapInfo.musicSource);
    editAtomStore.set(editPreviewTimeInputAtom, mapInfo.previewTime);
    editAtomStore.set(editTagsAtom, {
      type: "set",
      payload: mapInfo.tags?.map((tag) => ({ id: tag, text: tag, className: "" })) || [],
    });
  } else {
    editAtomStore.set(editCreatorIdAtom, null);
    editAtomStore.set(editVideoIdAtom, newVideoId);

    if (isBackUp) {
      db.editorNewCreateBak
        .get({ optionName: "backupMapInfo" })
        .then((data: IndexDBOption | undefined) => {
          if (data) {
            const backupMap = data.value as EditorNewMapBackUpInfoData;

            editAtomStore.set(editMapTitleAtom, backupMap.title);
            editAtomStore.set(editMapArtistNameAtom, backupMap.artistName);
            editAtomStore.set(editCreatorCommentAtom, backupMap.creatorComment);
            editAtomStore.set(editMusicSourceAtom, backupMap.musicSource);
            editAtomStore.set(editPreviewTimeInputAtom, backupMap.previewTime);
            editAtomStore.set(editTagsAtom, {
              type: "set",
              payload: backupMap.tags?.map((tag) => ({ id: tag, text: tag, className: "" })) || [],
            });
          }
        });
    }
  }

  return (
    <InfoTabProvider>
      <RefsProvider>
        <QueryClientProvider client={queryClient}>
          <ReduxProvider store={editStore}>
            <JotaiProvider store={editAtomStore}>{children}</JotaiProvider>
          </ReduxProvider>
        </QueryClientProvider>
      </RefsProvider>
    </InfoTabProvider>
  );
};

export default EditProvider;
