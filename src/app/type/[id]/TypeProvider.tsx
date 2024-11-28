"use client";
import { getGlobalAtomStore, previewVideoIdAtom } from "@/components/atom/globalAtoms";
import { GetInfoData } from "@/types/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createStore, Provider as JotaiProvider } from "jotai";
import { DevTools } from "jotai-devtools";
import { useEffect } from "react";
import { UserTypingOptions } from "../ts/type";
import { hasLocalLikeAtom, userOptionsAtom } from "../type-atoms/gameRenderAtoms";
import { RefsProvider } from "../type-contexts/refsProvider";

const typeAtomStore = createStore();
export const getTypeAtomStore = () => typeAtomStore;
const queryClient = new QueryClient();

interface TypeProviderProps {
  mapInfo?: GetInfoData;
  userTypingOptions?: UserTypingOptions | undefined;
  children: React.ReactNode;
}
const TypeProvider = ({ mapInfo, userTypingOptions, children }: TypeProviderProps) => {
  const globalAtomStore = getGlobalAtomStore();
  globalAtomStore.set(previewVideoIdAtom, null);
  typeAtomStore.set(hasLocalLikeAtom, !!mapInfo?.mapLike[0]?.isLiked);
  useEffect(() => {
    window.getSelection()!.removeAllRanges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (userTypingOptions) {
    typeAtomStore.set(userOptionsAtom, userTypingOptions);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RefsProvider>
        <JotaiProvider store={typeAtomStore}>
          <DevTools />
          {children}
        </JotaiProvider>
      </RefsProvider>
    </QueryClientProvider>
  );
};

export default TypeProvider;
