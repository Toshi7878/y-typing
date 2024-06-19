/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

interface TabContentProps {
  className?: string;
}
export default function TabContent({ className }: TabContentProps) {
  console.log("Tab");

  return (
    <Tabs
      // index={tabIndex}
      // onChange={(index) => dispatch(setTabIndex(index))}
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
        <TabPanel></TabPanel>

        <TabPanel></TabPanel>
      </TabPanels>
    </Tabs>
  );
}
