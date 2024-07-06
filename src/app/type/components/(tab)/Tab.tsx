/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import TabStatus, { TabStatusRef } from "./tab/TabStatus";
import TabRanking from "./tab/TabRanking";

interface TabContentProps {
  className?: string;
  tabStatusRef: React.RefObject<TabStatusRef>;
}
export default function TabContent({ className, tabStatusRef }: TabContentProps) {
  console.log("Tab");

  return (
    <Tabs
      // index={tabIndex}
      // onChange={(index) => dispatch(setTabIndex(index))}
      className={className}
      isFitted
      flex={1}
      size="sm"
      position="relative"
      variant="line"
      colorScheme="teal" // ここで色を指定します
    >
      <TabList height="24px" borderBottom="1px solid lightgray">
        <Tab>ステータス</Tab>
        <Tab>ランキング</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <TabStatus ref={tabStatusRef} />
        </TabPanel>

        <TabPanel>
          <TabRanking />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
