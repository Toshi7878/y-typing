import React from "react";
import { RefsProvider } from "../type-contexts/refsProvider";

const TypeProvider = ({ children }) => {
  return <RefsProvider>{children}</RefsProvider>;
};

export default TypeProvider;
