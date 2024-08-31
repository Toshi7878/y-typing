"use client";
import React from "react";
import InfoTabProvider from "../edit-contexts/InfoTabProvider";
import { RefsProvider } from "../edit-contexts/refsProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import editStore from "../redux/store";
import { Provider as ReduxProvider } from "react-redux";

const queryClient = new QueryClient();

const EditProvider = ({ children }) => {
  return (
    <InfoTabProvider>
      <RefsProvider>
        <QueryClientProvider client={queryClient}>
          <ReduxProvider store={editStore}>{children} </ReduxProvider>
        </QueryClientProvider>
      </RefsProvider>
    </InfoTabProvider>
  );
};

export default EditProvider;
