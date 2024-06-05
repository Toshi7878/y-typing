import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { useForm, FormProvider, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputFormSchema } from "./Schema";

interface InfoTabProviderProps {
  children: ReactNode;
}

const InfoTabContext = createContext<UseFormReturn<InputFormSchema["InfoTab"]> | null>(null);

export const InfoTabProvider: React.FC<InfoTabProviderProps> = ({ children }) => {
  const methods = useForm<InputFormSchema["InfoTab"]>({
    defaultValues: {
      url: "",
      title: "",
    },
    // resolver: zodResolver(TabFormSchema),
  });

  const value = useMemo(() => methods, [methods]);

  return (
    <InfoTabContext.Provider value={value}>
      <FormProvider {...methods}>{children}</FormProvider>
    </InfoTabContext.Provider>
  );
};

export const useInfoTabForm = () => useContext(InfoTabContext);

export default InfoTabProvider;
