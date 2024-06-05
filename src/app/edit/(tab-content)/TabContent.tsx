import { useEffect } from "react";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

import EditorTab from "./EditorTab";
import { useDispatch, useSelector } from "react-redux";
import { setTabIndex } from "../(redux)/tabIndexSlice";
import InfoTab from "./InfoTab";

export default function TabContent({ className }: { className?: string }) {
  const dispatch = useDispatch();
  const tabIndex: number = useSelector(
    (state: { tabIndex: { value: number } }) => state.tabIndex.value
  );
  useEffect(() => {
    // タブインデックスが変更されたときに自動的に対応するタブに切り替えます。
    // ここでは、タブのインデックスが変更されたことをコンソールに出力しています。
    console.log(`現在のタブインデックス: ${tabIndex}`);
  }, [tabIndex]);

  return (
    <Tabs
      index={tabIndex}
      onChange={(index) => dispatch(setTabIndex(index))}
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
          <InfoTab />
        </TabPanel>

        <TabPanel>
          <EditorTab />
        </TabPanel>

        <TabPanel>
          <p>three!</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
