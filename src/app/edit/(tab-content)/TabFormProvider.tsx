import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { TabFormSchema } from "./validationSchema";

export interface DefaultValues {
  EditorTab: {
    time: string;
    lyrics: string;
    word: string;
    lineNumber?: string;
  };
  InfoTab: {
    url: string;
    title: string;
  };
}

const TabFormProvider = ({ children }) => {
  const methods = useForm<DefaultValues>({
    defaultValues: {
      EditorTab: {
        time: "",
        lyrics: "",
        word: "",
        lineNumber: "",
      },
      InfoTab: {
        url: "",
        title: "",
      },
    },
    resolver: zodResolver(TabFormSchema),
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

export default TabFormProvider;
