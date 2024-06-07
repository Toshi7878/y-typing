import React, { ReactNode } from "react";
import InfoTabProvider from "./(contexts)/InfoTabProvider";
import UploadTabProvider from "./(contexts)/UploadTabProvider";

interface InputProviderProps {
  children: ReactNode;
}

const InputProvider: React.FC<InputProviderProps> = ({ children }) => {
  return (
    <InfoTabProvider>
      <UploadTabProvider>{children}</UploadTabProvider>
    </InfoTabProvider>
  );
};

export default InputProvider;
