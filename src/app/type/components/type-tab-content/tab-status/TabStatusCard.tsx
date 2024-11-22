import React, { useRef } from "react";
import { Table, TableContainer, Card, CardBody, useTheme } from "@chakra-ui/react"; // Card, CardBodyを追加
import { Status } from "@/app/type/ts/type";
import { ThemeColors } from "@/types";
import StatusTbody from "./child/StatusTbody";

export interface TabStatusRef {
  getStatus: () => Status;
  setStatus: (newStatus: Status) => void;
  resetStatus: () => void;
}

interface TabStatusProps {
  height: string;
}

const TabStatusCard = (props: TabStatusProps) => {
  const theme: ThemeColors = useTheme();
  const tabStatusRef = useRef(null);

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
            <StatusTbody ref={tabStatusRef} />
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
};

export default TabStatusCard;
