import { ThemeColors } from "@/types";
import { Card, CardBody, Table, TableContainer, useTheme } from "@chakra-ui/react";
import StatusTbody from "./child/StatusTbody";

interface TabStatusProps {
  height: string;
}

const TabStatusCard = (props: TabStatusProps) => {
  const theme: ThemeColors = useTheme();

  return (
    <Card
      className="tab-card"
      variant="filled"
      bg={theme.colors.background.card}
      boxShadow="lg"
      color={theme.colors.text.body}
    >
      <CardBody>
        <TableContainer>
          <Table
            minH={props.height}
            variant="unstyled"
            className="table-fixed overflow-hidden"
            overflowY="auto"
          >
            <StatusTbody />
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
};

export default TabStatusCard;
