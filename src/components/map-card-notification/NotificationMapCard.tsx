"use client";
import { Card, CardBody, CardHeader, useTheme } from "@chakra-ui/react";
import { ThemeColors } from "@/types";
import { NotificationSelect } from "@/types/api";
import UserLinkText from "../custom-ui/UserLinkText";

interface MapCardProps {
  notify: NotificationSelect;
  children: React.ReactNode;
}
function NotificationMapCard({ notify, children }: MapCardProps) {
  const theme: ThemeColors = useTheme();

  return (
    <Card
      borderRadius="lg"
      transition="box-shadow 0.3s"
      _hover={{
        boxShadow: theme.colors.home.card.hover,
      }}
      maxW="100%"
    >
      <CardHeader fontSize="sm" py={2} px={2} bg={theme.colors.background.header} roundedTop="md">
        <UserLinkText userId={notify.visitor_id} userName={notify.visitor.name} />
        さんが スコア {notify.visitorResult.score - notify.visitedResult.score} 差で
        {Number(notify.oldRank)}
        位の記録を抜かしました。
      </CardHeader>
      <CardBody
        color={theme.colors.text.body}
        bg={theme.colors.background.card}
        borderRadius="md"
        display="flex"
        alignItems="start"
        border="none"
        pt={0}
        px={0}
        pb={0}
      >
        {children}
      </CardBody>
    </Card>
  );
}

export default NotificationMapCard;
