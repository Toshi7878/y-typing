"use client";
import React from "react";
import InfoTabProvider from "../edit-contexts/InfoTabProvider";
import { RefsProvider } from "../edit-contexts/refsProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import editStore from "../redux/store";
import { Provider as ReduxProvider } from "react-redux";
import { createStore, Provider as JotaiProvider } from "jotai";
import { GetInfoData } from "@/types/api";

const queryClient = new QueryClient();
const editAtomStore = createStore();

export const getEditAtomStore = () => editAtomStore;

interface EditProviderProps {
  mapInfo?: GetInfoData;
  children: React.ReactNode;
}

const EditProvider = ({ mapInfo, children }: EditProviderProps) => {
  if (mapInfo) {
    // editAtomStore.set(title,mapInfo.title)
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
