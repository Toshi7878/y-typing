import { Badge } from "@chakra-ui/react";
import React from "react";

interface MapBadgeProps {
  children: React.ReactNode;
}

const MapBadge = ({ children }: MapBadgeProps) => {
  return (
    <Badge fontSize="sm" borderRadius="full" px={2}>
      {children}
    </Badge>
  );
};

export default MapBadge;
