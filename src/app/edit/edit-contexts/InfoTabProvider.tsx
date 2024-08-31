"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { useForm, FormProvider, UseFormReturn } from "react-hook-form";
import { MovieInfoFormSchema } from "./Schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
interface InfoTabProviderProps {
  children: ReactNode;
}

const schema = z.object({
  title: z.string().min(1),
});

const InfoTabContext = createContext<UseFormReturn<MovieInfoFormSchema> | null>(null);

const InfoTabProvider: React.FC<InfoTabProviderProps> = ({ children }) => {
  const methods = useForm<MovieInfoFormSchema>({
    defaultValues: {
      url: "",
      title: "",
      creatorComment: "",
    },
    mode: "all",
    resolver: zodResolver(schema),
    criteriaMode: "all",
  });

  return (
    <InfoTabContext.Provider value={methods}>
      <FormProvider {...methods}>{children}</FormProvider>
    </InfoTabContext.Provider>
  );
};

export const useInfoTabForm = () => useContext(InfoTabContext);

export default InfoTabProvider;
