import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { useForm, FormProvider, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputFormSchema } from "./Schema";

interface TimeRangeProviderProps {
  children: ReactNode;
}

const TimeRangeContext = createContext<UseFormReturn<InputFormSchema["TimeRange"]> | null>(null);

export const TimeRangeProvider: React.FC<TimeRangeProviderProps> = ({ children }) => {
  const methods = useForm<InputFormSchema["TimeRange"]>({
    defaultValues: {
      range: "0",
    },
    // resolver: zodResolver(TabFormSchema),
  });

  const value = useMemo(() => methods, [methods]);

  return (
    <TimeRangeContext.Provider value={value}>
      <FormProvider {...methods}>{children}</FormProvider>
    </TimeRangeContext.Provider>
  );
};

export const useTimeRangeForm = () => useContext(TimeRangeContext);

export default TimeRangeProvider;
