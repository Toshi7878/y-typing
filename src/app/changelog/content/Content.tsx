"use client";
import UpdateHistory from "./components/UpdateHistory";
import ContentHeading from "./components/Heading";
import { useEffect } from "react";
import nProgress from "nprogress";

const Content = () => {
  useEffect(() => {
    window.getSelection()!.removeAllRanges();
    nProgress.done();
  }, []);

  return (
    <>
      <ContentHeading />
      <UpdateHistory />
    </>
  );
};

export default Content;
