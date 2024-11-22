"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createStore, Provider as JotaiProvider } from "jotai";
import { useSearchParams } from "next/navigation";
import { FilterMode } from "./ts/type";
import { searchResultKeyWordsAtom, searchResultKpmAtom, searchResultModeAtom } from "./atoms/atoms";
import { DEFAULT_KPM_SEARCH_RANGE } from "./ts/const/consts";

const queryClient = new QueryClient();
const timelineAtomStore = createStore();

export const getTimelineAtomStore = () => timelineAtomStore;

interface TimelineProviderProps {
  children: React.ReactNode;
}

const TimelineProvider = ({ children }: TimelineProviderProps) => {
  const searchParams = useSearchParams();
  const searchMode = (searchParams.get("mode") || "all") as FilterMode;
  const minKpm = Number(searchParams.get("min-kpm") ?? DEFAULT_KPM_SEARCH_RANGE.min);
  const maxKpm = Number(searchParams.get("max-kpm") ?? DEFAULT_KPM_SEARCH_RANGE.max);
  const searchUserKeyWord = searchParams.get("user-keyword") || "";
  const searchMapKeyWord = searchParams.get("map-keyword") || "";
  timelineAtomStore.set(searchResultKeyWordsAtom, {
    mapKeyWord: searchMapKeyWord,
    userName: searchUserKeyWord,
  });

  timelineAtomStore.set(searchResultModeAtom, searchMode);
  timelineAtomStore.set(searchResultKpmAtom, {
    minValue: minKpm,
    maxValue: maxKpm,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider store={timelineAtomStore}>{children}</JotaiProvider>
    </QueryClientProvider>
  );
};

export default TimelineProvider;
