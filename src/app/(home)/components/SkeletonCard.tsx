import { ThemeColors } from "@/types";
import { Card, CardBody, useBreakpointValue, useTheme } from "@chakra-ui/react";
import SkeletonThumbnail from "./child/SkeletonThumbnail";
import SkeletonRightInfo from "./child/SkeletonRightInfo";

function SkeletonCard() {
  const theme: ThemeColors = useTheme();

  return (
    <Card
      borderRadius="lg"
      transition="box-shadow 0.3s"
      _hover={{
        boxShadow: theme.colors.home.card.hover,
      }}
      size="lg"
    >
      <CardBody
        color={theme.colors.text.body}
        bg={theme.colors.background.card}
        borderRadius="md"
        className="flex items-start"
        style={{ padding: 0, border: "none" }}
      >
        <SkeletonThumbnail />
        <SkeletonRightInfo />
      </CardBody>
    </Card>
  );
}

export default SkeletonCard;
