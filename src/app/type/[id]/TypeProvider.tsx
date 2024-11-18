"use client";
import { RefsProvider } from "../type-contexts/refsProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createStore, Provider as JotaiProvider } from "jotai";
import { GetInfoData } from "@/types/api";
import { useEffect } from "react";
import { hasLocalLikeAtom, userOptionsAtom } from "../type-atoms/gameRenderAtoms";
import { UserTypingOptions } from "../ts/type";

export const queryClient = new QueryClient();
const typeAtomStore = createStore();

export const getTypeAtomStore = () => typeAtomStore;

interface TypeProviderProps {
  mapInfo?: GetInfoData;
  userTypingOptions?: UserTypingOptions | undefined;
  children: React.ReactNode;
}
const TypeProvider = ({ mapInfo, userTypingOptions, children }: TypeProviderProps) => {
  typeAtomStore.set(hasLocalLikeAtom, !!mapInfo?.hasLike);
  if (userTypingOptions) {
    console.log(userTypingOptions);
    typeAtomStore.set(userOptionsAtom, userTypingOptions);
  }

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
