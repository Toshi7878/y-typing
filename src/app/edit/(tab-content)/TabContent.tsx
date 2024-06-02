// ts
import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Editor from "./Editor";

export default function TabContent({ className }: { className?: string }) {
  return (
    <Tabs
      border="1px solid black"
      className={className}
      isFitted
      size="sm"
      variant="enclosed"
    >
      <TabList height="24px">
        <Tab>情報</Tab>
        <Tab>エディター</Tab>
        <Tab>保存</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <p>one!</p>
        </TabPanel>
        <TabPanel>
          <Editor />
        </TabPanel>
        <TabPanel>
          <p>three!</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
