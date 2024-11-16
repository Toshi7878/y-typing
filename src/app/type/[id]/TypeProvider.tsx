"use client";
import { RefsProvider } from "../type-contexts/refsProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createStore, Provider as JotaiProvider } from "jotai";
import { GetInfoData } from "@/types/api";
import { useEffect } from "react";
import { hasLocalLikeAtom } from "../type-atoms/gameRenderAtoms";

export const queryClient = new QueryClient();
const typeAtomStore = createStore();

export const getTypeAtomStore = () => typeAtomStore;

interface TypeProviderProps {
  mapInfo?: GetInfoData;
  children: React.ReactNode;
}
const TypeProvider = ({ mapInfo, children }: TypeProviderProps) => {
  typeAtomStore.set(hasLocalLikeAtom, !!mapInfo?.hasLike);

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
