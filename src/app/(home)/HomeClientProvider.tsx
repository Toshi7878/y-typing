"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { useSearchParams } from "next/navigation";
import { getHomeAtomStore, searchMapKeyWordsAtom } from "./atoms/atoms";

const queryClient = new QueryClient();

interface TimelineProviderProps {
  children: React.ReactNode;
}

const HomeProvider = ({ children }: TimelineProviderProps) => {
  const homeAtomStore = getHomeAtomStore();
  const searchParams = useSearchParams();
  const searchMapKeyWord = searchParams.get("map-keyword") || "";
  homeAtomStore.set(searchMapKeyWordsAtom, searchMapKeyWord);

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider store={homeAtomStore}>{children}</JotaiProvider>
    </QueryClientProvider>
  );
};

export default HomeProvider;
