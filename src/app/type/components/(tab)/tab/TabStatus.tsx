import React from "react";
import { Table, Tbody, Tr, Td, TableContainer } from "@chakra-ui/react";

import "../../../style/statusTable.scss";
import { mapAtom, statusAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtom } from "jotai";
const TabStatus = () => {
  const [map] = useAtom(mapAtom);
  const [status] = useAtom(statusAtom);

  if (!map) return null; // mapが存在しない場合は何も表示しない

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
            <Td id="typeCount">
              <span className="label">Type</span>
              <span className="position-relative">
                <span className="status-value">{status["typeCount"]}</span>
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
                <span className="status-value">{status["point"]}</span>
                <span className="status-border-bottom"></span>
              </span>
            </Td>
            <Td id="missCount">
              <span className="label">Miss</span>
              <span className="position-relative">
                <span className="status-value">{status["missCount"]}</span>
                <span className="status-border-bottom"></span>
              </span>
            </Td>
            <Td id="lostCount">
              <span className="label">Lost</span>
              <span className="position-relative">
                <span className="status-value">0</span>
                <span className="status-border-bottom"></span>
              </span>
            </Td>
            <Td id="lineCount">
              <span className="label">Line</span>
              <span className="position-relative">
                <span className="status-value">
                  {map.lineLength - (status.lineCompleteCount + status.lineFailureCount)}
                </span>
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
