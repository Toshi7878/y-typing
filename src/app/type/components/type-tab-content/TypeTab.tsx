import { Tabs, TabList, TabPanels, Tab, TabPanel, useTheme, HStack, Box } from "@chakra-ui/react";
import TabRanking from "./tab-ranking/TabRanking";
import { useEffect, useRef } from "react";
import { ThemeColors } from "@/types";
import TabStatus from "./tab-status/TabStatus";
import TabIcons from "./child/TabIcons";
import { useSetTabIndexAtom, useTabIndexAtom } from "../../type-atoms/gameRenderAtoms";

interface TypeTabContentProps {
  className?: string;
}

const tabLists = ["ステータス", "ランキング"];
export default function TypeTabContent({ className }: TypeTabContentProps) {
  console.log("Tab");
  const tabIndex = useTabIndexAtom();
  const setTabIndex = useSetTabIndexAtom();
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
      index={tabIndex}
      onChange={(index: number) => setTabIndex(index as 0 | 1)}
      className={className}
      variant="unstyled"
    >
      <HStack
        justifyContent="space-between"
        w="100%"
        borderBottom={`1px solid ${"text.body"}55`}
        style={{ userSelect: "none" }}
      >
        <TabList height="33px" px="8" w="100%">
          {tabLists.map((tabName, index) => {
            return (
              <Tab
                key={index}
                width="200px"
                opacity={tabIndex === index ? 1 : 0.5}
                borderBottom={tabIndex === index ? `1px solid ${"text.body"}` : ""}
                color={"text.body"}
                _hover={{ bg: "rgba(0, 0, 0, 0.1)", color: "text.body" }}
                _selected={{ color: "text.body" }}
              >
                {tabName}
              </Tab>
            );
          })}
        </TabList>
        <TabIcons />
      </HStack>
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
