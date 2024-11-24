"use client";
import { Card, CardBody, useTheme } from "@chakra-ui/react";
import { ThemeColors } from "@/types";

interface MapCardProps {
  maxW: string;
  children: React.ReactNode;
}
function MapCard({ maxW, children }: MapCardProps) {
  const theme: ThemeColors = useTheme();

  return (
    <Card
      borderRadius="lg"
      transition="box-shadow 0.3s"
      _hover={{
        boxShadow: theme.colors.home.card.hover,
      }}
      maxW={maxW}
    >
      <CardBody
        color={theme.colors.text.body}
        bg={theme.colors.background.card}
        borderRadius="md"
        display="flex"
        alignItems="start"
        style={{ padding: 0, border: "none" }}
      >
        {children}
      </CardBody>
    </Card>
  );
}

export default MapCard;
