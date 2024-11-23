"use client";
import { getGlobalAtomStore, volumeAtom } from "@/components/atom/globalAtoms";
import { Provider as JotaiProvider } from "jotai";
import { db } from "@/lib/db";
import { GlobalRefProvider } from "@/components/globalRefContext/GlobalRefProvider";
import { useEffect } from "react";

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const globalAtomStore = getGlobalAtomStore();

  useEffect(() => {
    const getUserVolume = async () => {
      try {
        const entry = await db.globalOption.where("optionName").equals("volume-range").first();

        if (entry) {
          globalAtomStore.set(volumeAtom, Number(entry.value));
        }
        const volumeRange = Number(entry?.value); // volume-rangeキーのみを取得

        return volumeRange;
      } catch (error) {
        console.error("Error fetching volume range:", error);
      }
    };
    getUserVolume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <GlobalRefProvider>
        <JotaiProvider store={globalAtomStore}>{children}</JotaiProvider>
      </GlobalRefProvider>
    </>
  );
};

export default GlobalProvider;
