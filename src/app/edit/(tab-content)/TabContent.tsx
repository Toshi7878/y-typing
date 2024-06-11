/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";

import { Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator } from "@chakra-ui/react";

import EditorTab from "./EditorTab";
import { useDispatch, useSelector } from "react-redux";
import { setTabIndex } from "../(redux)/tabIndexSlice";
import { RootState } from "../(redux)/store";
import { useRefs } from "../(contexts)/refsProvider";
import InfoUploadTab from "./InfoUploadTab";

export default function TabContent({ className }: { className?: string }) {
  console.log("Tab");

  const editorTabRef = useRef(null);
  const infoUploadTabRef = useRef(null);

  const { setRef } = useRefs();

  useEffect(() => {
    setRef("editorTab", editorTabRef.current);
    setRef("infoUploadTab", infoUploadTabRef.current);
  }, [editorTabRef]);

  const dispatch = useDispatch();
  const tabIndex: number = useSelector(
    (state: { tabIndex: { value: number } }) => state.tabIndex.value
  );
  const [isDisabled, setIsDisabled] = useState(true);

  const isStarted = useSelector((state: RootState) => state.ytState.isStarted);
  useEffect(() => {
    if (isStarted && isDisabled) {
      setIsDisabled(false);
    }
  }, [isStarted]);

  return (
    <Tabs
      index={tabIndex}
      onChange={(index) => dispatch(setTabIndex(index))}
      border="1px solid"
      className={className}
      isFitted
      size="sm"
      position="relative"
      variant="unstyled"
    >
      <TabList height="24px" borderBottom="1px solid lightgray">
        <Tab borderRight="1px solid lightgray">情報 & 保存</Tab>
        <Tab borderRight="1px solid lightgray" isDisabled={isDisabled}>
          エディター
        </Tab>
      </TabList>

      {/* ↓ウィンドウリサイズイベント時に再レンダリングしたほうが良さそう */}
      {isDisabled ? "" : <TabIndicator mt="-1.5px" height="2px" bg="blue.500" borderRadius="1px" />}

      <TabPanels>
        <TabPanel>
          <InfoUploadTab ref={infoUploadTabRef} />
        </TabPanel>

        <TabPanel>
          <EditorTab ref={editorTabRef} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
