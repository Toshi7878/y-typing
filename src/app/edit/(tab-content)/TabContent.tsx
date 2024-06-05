import { useEffect, useState } from "react";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

import EditorTab from "./EditorTab";
import { useDispatch, useSelector } from "react-redux";
import { setTabIndex } from "../(redux)/tabIndexSlice";
import InfoTab from "./InfoTab";
import UploadTab from "./UploadTab";

export default function TabContent({ className }: { className?: string }) {
  console.log("Tab");

  const dispatch = useDispatch();
  const tabIndex: number = useSelector(
    (state: { tabIndex: { value: number } }) => state.tabIndex.value
  );
  const [isDisabled, setIsDisabled] = useState(true);

  const playing: boolean = useSelector(
    (state: { playing: { value: boolean } }) => state.playing.value
  );
  useEffect(() => {
    if (playing && isDisabled) {
      setIsDisabled(false);
    }
  }, [playing, isDisabled]);

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
        <Tab isDisabled={isDisabled}>エディター</Tab>
        <Tab isDisabled={isDisabled}>保存</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <InfoTab />
        </TabPanel>

        <TabPanel>
          <EditorTab />
        </TabPanel>

        <TabPanel>
          <UploadTab />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
