import React, { ReactNode, useMemo } from "react";
import EditorTabProvider from "./(contexts)/editorTabProvider";
import InfoTabProvider from "./(contexts)/InfoTabProvider";
import UploadTabProvider from "./(contexts)/UploadTabProvider";
import TimeRangeProvider from "./(contexts)/TimeRangeContext";

interface InputProviderProps {
  children: ReactNode;
}

const InputProvider: React.FC<InputProviderProps> = ({ children }) => {
  const editorTabProvider = useMemo(
    () => <EditorTabProvider>{children}</EditorTabProvider>,
    [children]
  );
  const infoTabProvider = useMemo(() => <InfoTabProvider>{children}</InfoTabProvider>, [children]);
  const uploadTabProvider = useMemo(
    () => <UploadTabProvider>{children}</UploadTabProvider>,
    [children]
  );
  const timeRangeProvider = useMemo(
    () => <TimeRangeProvider>{children}</TimeRangeProvider>,
    [children]
  );

  return (
    <EditorTabProvider>
      <InfoTabProvider>
        <UploadTabProvider>
          <TimeRangeProvider>{children}</TimeRangeProvider>
        </UploadTabProvider>
      </InfoTabProvider>
    </EditorTabProvider>
  );
};

export default InputProvider;
