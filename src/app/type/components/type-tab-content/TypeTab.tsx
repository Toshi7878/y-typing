import { Tabs, TabList, TabPanels, Tab, TabPanel, useTheme } from "@chakra-ui/react";
import TabStatus from "./tab-status/TabStatus";
import TabRanking from "./tab-ranking/TabRanking";
import { useAtom } from "jotai";
import { tabIndexAtom } from "../../type-atoms/gameRenderAtoms";
import { useEffect, useRef } from "react";
import { ThemeColors } from "@/types";

interface TypeTabContentProps {
  className?: string;
}

const tabLists = ["ステータス", "ランキング"];
export default function TypeTabContent({ className }: TypeTabContentProps) {
  console.log("Tab");
  const [tabIndex, setTabIndex] = useAtom(tabIndexAtom);
  const theme: ThemeColors = useTheme();

  const tabStatusRef = useRef(null);

  useEffect(() => {
    return () => {
      setTabIndex(1);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tabs
      index={tabIndex} // デフォルトの選択されたタブを設定
      onChange={(index: number) => setTabIndex(index as 0 | 1)} // 型を 'number' に変更
      className={className}
      variant="line"
      colorScheme="black" // ここで色を指定します
    >
      <TabList height="33px" px="8" borderBottom={`1px solid ${theme.colors.color}aa`}>
        {tabLists.map((tabName, index) => {
          return (
            <Tab
              key={index}
              width="200px"
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
        <TabPanel px={0}>
          <TabStatus ref={tabStatusRef} height={"208px"} />
        </TabPanel>

        <TabPanel px={0}>
          <TabRanking height={"220px"} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
