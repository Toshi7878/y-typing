import React from "react";
import { Table, Tbody, Tr, Td, TableContainer } from "@chakra-ui/react";

import "../../../style/statusTable.scss";
const TabStatus = () => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Tbody>
          <Tr>
            <Td id="score">
              <span className="">Score</span>
              <span className="position-relative">
                <span className="status-value">0</span>
                <span className="status-border-bottom"></span>
              </span>
            </Td>
            <Td id="type">
              <span className="label">Type</span>
              <span className="position-relative">
                <span className="status-value">0</span>
                <span className="status-border-bottom"></span>
              </span>
            </Td>
            <Td id="type_speed">
              <span className="label">kpm</span>
              <span className="position-relative">
                <span className="status-value">0</span>
                <span className="status-border-bottom"></span>
              </span>
            </Td>
            <Td id="rank">
              <span className="label">Rank</span>
              <span className="position-relative">
                <span className="status-value">0</span>
                <span className="status-border-bottom"></span>
              </span>
            </Td>
          </Tr>
          <Tr>
            <Td id="point">
              <span className="label">Point</span>
              <span className="position-relative">
                <span className="status-value">0</span>
                <span className="status-border-bottom"></span>
              </span>
            </Td>
            <Td id="miss">
              <span className="label">Miss</span>
              <span className="position-relative">
                <span className="status-value">0</span>
                <span className="status-border-bottom"></span>
              </span>
            </Td>
            <Td id="lost">
              <span className="label">Lost</span>
              <span className="position-relative">
                <span className="status-value">0</span>
                <span className="status-border-bottom"></span>
              </span>
            </Td>
            <Td id="line">
              <span className="label">Line</span>
              <span className="position-relative">
                <span className="status-value">52</span>
                <span className="status-border-bottom"></span>
              </span>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TabStatus;
