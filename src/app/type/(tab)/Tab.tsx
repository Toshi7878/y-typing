/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator } from "@chakra-ui/react";

import { useDispatch, useSelector } from "react-redux";
import { setTabIndex } from "../(redux)/tabIndexSlice";

interface TabContentProps {
  className?: string;
}
export default function TabContent({ className }: TabContentProps) {
  console.log("Tab");

  const dispatch = useDispatch();
  const tabIndex: number = useSelector(
    (state: { tabIndex: { value: number } }) => state.tabIndex.value,
  );

  return (
    <Tabs
      index={tabIndex}
      onChange={(index) => dispatch(setTabIndex(index))}
      border="1px solid"
      className={className}
      isFitted
      flex={1}
      size="sm"
      position="relative"
      variant="line"
    >
      <TabList height="24px" borderBottom="1px solid lightgray">
        <Tab borderRight="1px solid lightgray">ステータス</Tab>
        <Tab borderRight="1px solid lightgray">ランキング</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>{/* <TabInfoUpload ref={infoUploadTabRef} /> */}</TabPanel>

        <TabPanel>{/* <TabEditor ref={editorTabRef} /> */}</TabPanel>
      </TabPanels>
    </Tabs>
  );
}
