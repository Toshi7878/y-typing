"use client";
import { RefsProvider } from "../type-contexts/refsProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createStore, Provider as JotaiProvider } from "jotai";
import { GetInfoData } from "@/types/api";
import { useEffect } from "react";

export const queryClient = new QueryClient();
const typeAtomStore = createStore();

export const getTypeAtomStore = () => typeAtomStore;

interface TypeProviderProps {
  mapInfo?: GetInfoData;
  children: React.ReactNode;
}
const TypeProvider = ({ mapInfo, children }: TypeProviderProps) => {
  // typeAtomStore.set(editMapTitleAtom, mapInfo.title);
  // typeAtomStore.set(editVideoIdAtom, mapInfo.videoId);
  // typeAtomStore.set(editCreatorIdAtom, mapInfo.creatorId);
  // typeAtomStore.set(editCreatorCommentAtom, mapInfo.creatorComment);
  // typeAtomStore.set(editPreviewTimeInputAtom, mapInfo.previewTime);

  // typeAtomStore.set(editTagsAtom, {
  //   type: "set",
  //   payload: mapInfo.tags?.map((tag) => ({ id: tag, text: tag, className: "" })) || [],
  // });

  useEffect(() => {
    window.getSelection()!.removeAllRanges();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <RefsProvider>
        <JotaiProvider store={typeAtomStore}>{children}</JotaiProvider>
      </RefsProvider>
    </QueryClientProvider>
  );
};

export default TypeProvider;
