"use client";
import { useSceneAtom } from "@/app/type/type-atoms/gameRenderAtoms";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
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
import { useEffect, useRef } from "react";
import ResultLineList from "./child/ResultLineList";

interface ResultDrawerProps {
  drawerClosure: UseDisclosureReturn;
}

function ResultDrawer({ drawerClosure }: ResultDrawerProps) {
  const { isOpen, onClose } = drawerClosure;
  // const [drawerHeight, setDrawerHeight] = useState("100vh");
  const theme: ThemeColors = useTheme();
  const { setRef } = useRefs();
  const scene = useSceneAtom();

  const modalContentRef = useRef(null);

  // useEffect(() => {
  //   if ((scene === "practice" || scene === "replay") && modalContentRef.current) {
  //     setRef("modalContentRef", modalContentRef.current);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [scene]);

  useEffect(() => {
    if (modalContentRef.current) {
      console.log(modalContentRef.current);
    }
  }, [modalContentRef]);
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
      <style>
        {`
        .result-line-select-outline {
          outline:3px solid ${theme.colors.primary.main};
        }

        .result-line-hover:hover {
          outline:1px solid ${theme.colors.text.body};
        }
        `}
      </style>
    </Drawer>
  );
}

export default ResultDrawer;
