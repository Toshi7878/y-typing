import { Tabs, TabList, TabPanels, Tab, TabPanel, useTheme, HStack, Box } from "@chakra-ui/react";
import TabRanking from "./tab-ranking/TabRanking";
import { useAtom } from "jotai";
import { tabIndexAtom } from "../../type-atoms/gameRenderAtoms";
import { useEffect, useRef } from "react";
import { ThemeColors } from "@/types";
import { BiEdit } from "react-icons/bi";
import { useLinkClick } from "@/app/nprogress";
import { useParams } from "next/navigation";
import { Link } from "@chakra-ui/next-js";
import TabStatus from "./tab-status/TabStatus";
import TabIcons from "./child/TabIcons";

interface TypeTabContentProps {
  className?: string;
}

const tabLists = ["ステータス", "ランキング"];
export default function TypeTabContent({ className }: TypeTabContentProps) {
  console.log("Tab");
  const [tabIndex, setTabIndex] = useAtom(tabIndexAtom);
  const theme: ThemeColors = useTheme();
  const { id } = useParams();

  const handleLinkClick = useLinkClick();

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
        borderBottom={`1px solid ${theme.colors.color}55`}
        style={{ userSelect: "none" }}
      >
        <TabList height="33px" px="8" w="100%">
          {tabLists.map((tabName, index) => {
            return (
              <Tab
                key={index}
                width="200px"
                opacity={tabIndex === index ? 1 : 0.5}
                borderBottom={tabIndex === index ? `1px solid ${theme.colors.color}` : ""}
                color={theme.colors.color}
                _hover={{ bg: "rgba(0, 0, 0, 0.1)", color: theme.colors.color }}
                _selected={{ color: theme.colors.color }}
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
