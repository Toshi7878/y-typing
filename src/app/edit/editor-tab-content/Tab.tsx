"use client";
import { useEffect, useRef, useState } from "react";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

import TabEditor from "./tab-panels/TabEditor";
import { useDispatch, useSelector } from "react-redux";
import { setTabIndex } from "../redux/tabIndexSlice";
import { RootState } from "../redux/store";
import { useRefs } from "../edit-contexts/refsProvider";
import TabInfoUpload from "./tab-panels/TabInfoUpload";
import TabSettings from "./tab-panels/TabSettings";

interface TabContentProps {
  className?: string;
}
export default function TabContent({ className }: TabContentProps) {
  console.log("Tab");

  const editorTabRef = useRef(null);

  const { setRef } = useRefs();

  useEffect(() => {
    setRef("editorTab", editorTabRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorTabRef]);

  const dispatch = useDispatch();
  const tabIndex: number = useSelector(
    (state: { tabIndex: { value: number } }) => state.tabIndex.value,
  );
  const [isDisabled, setIsDisabled] = useState(true);

  const isStarted = useSelector((state: RootState) => state.ytState.isStarted);
  useEffect(() => {
    if (isStarted && isDisabled) {
      setIsDisabled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      variant="line"
    >
      <TabList height="24px" borderBottom="1px solid lightgray">
        <Tab borderRight="1px solid lightgray">情報 & 保存</Tab>
        <Tab borderRight="1px solid lightgray" isDisabled={isDisabled}>
          エディター
        </Tab>
        <Tab borderRight="1px solid lightgray">設定</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <TabInfoUpload />
        </TabPanel>

        <TabPanel>
          <TabEditor ref={editorTabRef} />
        </TabPanel>
        <TabPanel>
          <TabSettings />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
