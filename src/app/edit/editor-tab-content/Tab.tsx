"use client";
import { useEffect, useRef, useState } from "react";

import { Tabs, TabList, TabPanels, Tab, TabPanel, useTheme } from "@chakra-ui/react";

import TabEditor from "./tab-panels/TabEditor";
import { useDispatch, useSelector } from "react-redux";
import { setTabIndex } from "../redux/tabIndexSlice";
import { RootState } from "../redux/store";
import { useRefs } from "../edit-contexts/refsProvider";
import TabInfoUpload from "./tab-panels/TabInfoUpload";
import TabSettings from "./tab-panels/TabSettings";
import { ThemeColors } from "@/types";

interface TabContentProps {
  className?: string;
}

const tabLists = ["情報 & 保存", "エディター", "設定"];
export default function TabContent({ className }: TabContentProps) {
  console.log("Tab");

  const editorTabRef = useRef(null);

  const { setRef } = useRefs();
  const theme: ThemeColors = useTheme();

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
      className={className}
      isFitted
      size="sm"
      position="relative"
      variant="line"
      width="100%"
    >
      <TabList height="33px" px="8" borderBottom={`1px solid ${theme.colors.color}aa`}>
        {tabLists.map((tabName, index) => {
          return (
            <Tab
              key={index}
              opacity={tabIndex === index ? 1 : 0.5}
              color={theme.colors.color}
              _hover={{ bg: "rgba(0, 0, 0, 0.1)" }}
            >
              {tabName}
            </Tab>
          );
        })}
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
