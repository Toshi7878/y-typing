"use client";
import { ThemeColors } from "@/types";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  UseDisclosureReturn,
  useTheme,
} from "@chakra-ui/react";
import ResultLineList from "./child/ResultLineList";

interface ResultDrawerProps {
  drawerClosure: UseDisclosureReturn;
  modalContentRef: React.RefObject<HTMLDivElement>;
}

function ResultDrawer({ drawerClosure, modalContentRef }: ResultDrawerProps) {
  const { isOpen, onClose } = drawerClosure;
  // const [drawerHeight, setDrawerHeight] = useState("100vh");
  const theme: ThemeColors = useTheme();

  // useEffect(() => {
  //   const updateHeight = () => {
  //     setDrawerHeight(`${window.innerHeight}px`);
  //   };

  //   window.addEventListener("resize", updateHeight);
  //   updateHeight();

  //   return () => window.removeEventListener("resize", updateHeight);
  // }, []);
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay backgroundColor="transparent" />
      <DrawerContent height="100vh" backgroundColor={`${theme.colors.background.body}dd`}>
        <DrawerHeader fontSize="md" py={2} color={theme.colors.text.body}>
          タイピングリザルト
        </DrawerHeader>
        <DrawerCloseButton tabIndex={-1} autoFocus={false} mr={5} color={theme.colors.text.body} />
        <DrawerBody overflowY="auto" position="relative" ref={modalContentRef}>
          <ResultLineList onClose={onClose} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default ResultDrawer;
