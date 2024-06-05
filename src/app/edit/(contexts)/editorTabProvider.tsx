import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { useForm, FormProvider, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputFormSchema } from "./Schema";

interface EditorTabProviderProps {
  children: ReactNode;
}

const EditorTabContext = createContext<UseFormReturn<InputFormSchema["EditorTab"]> | null>(null);

export const EditorTabProvider: React.FC<EditorTabProviderProps> = ({ children }) => {
  const methods = useForm<InputFormSchema["EditorTab"]>({
    defaultValues: {
      time: "",
      lyrics: "",
      word: "",
      lineNumber: "",
      addLyrics: "",
    },
    // resolver: zodResolver(TabFormSchema),
  });

  const value = useMemo(() => methods, [methods]);

  return (
    <EditorTabContext.Provider value={value}>
      <FormProvider {...methods}>{children}</FormProvider>
    </EditorTabContext.Provider>
  );
};

export const useEditorTabForm = () => useContext(EditorTabContext);

export default EditorTabProvider;
