"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { createContext, ReactNode, useContext } from "react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MovieInfoFormSchema } from "./Schema";
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
