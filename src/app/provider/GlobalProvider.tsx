"use client";
import { getGlobalAtomStore } from "@/components/atom/globalAtoms";
import { Provider as JotaiProvider } from "jotai";
import { GlobalRefProvider } from "@/components/globalRefContext/GlobalRefProvider";

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const globalAtomStore = getGlobalAtomStore();

  return (
    <>
      <GlobalRefProvider>
        <JotaiProvider store={globalAtomStore}>{children}</JotaiProvider>
      </GlobalRefProvider>
    </>
  );
};

export default GlobalProvider;
