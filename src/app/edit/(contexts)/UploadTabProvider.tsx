import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { useForm, FormProvider, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputFormSchema } from "./Schema";

interface UploadTabProviderProps {
  children: ReactNode;
}

const UploadTabContext = createContext<UseFormReturn<InputFormSchema["UploadTab"]> | null>(null);

export const UploadTabProvider: React.FC<UploadTabProviderProps> = ({ children }) => {
  const methods = useForm<InputFormSchema["UploadTab"]>({
    defaultValues: {
      creatorComment: "",
    },
    // resolver: zodResolver(TabFormSchema),
  });

  const value = useMemo(() => methods, [methods]);

  return (
    <UploadTabContext.Provider value={value}>
      <FormProvider {...methods}>{children}</FormProvider>
    </UploadTabContext.Provider>
  );
};

export const useUploadTabForm = () => useContext(UploadTabContext);

export default UploadTabProvider;
