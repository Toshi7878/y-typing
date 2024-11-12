"use client";
import React, { useLayoutEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createStore, Provider as JotaiProvider } from "jotai";
import { useSearchParams } from "next/navigation";
import { FilterMode } from "./ts/type";
import { searchResultKeyWordsAtom, searchResultModeAtom } from "./atoms/atoms";

const queryClient = new QueryClient();
const timelineAtomStore = createStore();

export const getTimelineAtomStore = () => timelineAtomStore;

interface TimelineProviderProps {
  children: React.ReactNode;
}

const TimelineProvider = ({ children }: TimelineProviderProps) => {
  const searchParams = useSearchParams();
  const searchMode = (searchParams.get("mode") || "all") as FilterMode;
  const searchUserKeyWord = searchParams.get("user-keyword") || "";
  timelineAtomStore.set(searchResultKeyWordsAtom, {
    mapKeyWord: "",
    userName: searchUserKeyWord,
  });

  timelineAtomStore.set(searchResultModeAtom, searchMode);

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider store={timelineAtomStore}>{children}</JotaiProvider>
    </QueryClientProvider>
  );
};

export default TimelineProvider;
