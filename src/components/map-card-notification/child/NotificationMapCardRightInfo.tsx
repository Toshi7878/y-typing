"use client";
import { Flex } from "@chakra-ui/react";

interface MapCardProps {
  children: React.ReactNode;
}
function NotificationMapCardRightInfo({ children }: MapCardProps) {
  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      overflowX="hidden"
      width="100%"
      height="100%"
      pl={3}
      pt={0}
      fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }}
    >
      {children}
    </Flex>
  );
}

export default NotificationMapCardRightInfo;
