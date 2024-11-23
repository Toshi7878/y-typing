"use client";
import { RefsProvider } from "../type-contexts/refsProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { GetInfoData } from "@/types/api";
import { useEffect } from "react";
import {
  getTypeAtomStore,
  hasLocalLikeAtom,
  inputModeAtom,
  userOptionsAtom,
} from "../type-atoms/gameRenderAtoms";
import { InputModeType, UserTypingOptions } from "../ts/type";

export const queryClient = new QueryClient();

interface TypeProviderProps {
  mapInfo?: GetInfoData;
  userTypingOptions?: UserTypingOptions | undefined;
  children: React.ReactNode;
}
const TypeProvider = ({ mapInfo, userTypingOptions, children }: TypeProviderProps) => {
  const typeAtomStore = getTypeAtomStore();
  typeAtomStore.set(hasLocalLikeAtom, !!mapInfo?.hasLike);
  useEffect(() => {
    window.getSelection()!.removeAllRanges();
    typeAtomStore.set(
      inputModeAtom,
      (localStorage.getItem("inputMode") || "roma") as InputModeType,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (userTypingOptions) {
    typeAtomStore.set(userOptionsAtom, userTypingOptions);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RefsProvider>
        <JotaiProvider store={typeAtomStore}>{children}</JotaiProvider>
      </RefsProvider>
    </QueryClientProvider>
  );
};

export default TypeProvider;
