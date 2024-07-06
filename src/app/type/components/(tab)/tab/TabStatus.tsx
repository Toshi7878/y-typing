import React from "react";
import { Table, Tbody, Tr, Td, TableContainer } from "@chakra-ui/react";

import "../../../style/statusTable.scss";
import { mapAtom, statusAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { useAtom } from "jotai";
const TabStatus = () => {
  const [map] = useAtom(mapAtom);
  const [status] = useAtom(statusAtom);
  if (!map) return null; // mapが存在しない場合は何も表示しない

  const STATUS_LABEL = ["score", "type", "kpm", "rank", "point", "miss", "lost", "line"];
  return (
    <TableContainer>
      <Table variant="simple">
        <Tbody>
          {/* 1段目 */}
          <Tr>
            {STATUS_LABEL.slice(0, 4).map((label) => {
              return (
                <Td key={label} id={label}>
                  <span className="">{label}</span>
                  <span className="position-relative">
                    <span className="status-value">{status[label]}</span>
                    <span className="status-border-bottom"></span>
                  </span>
                </Td>
              );
            })}
          </Tr>
          {/* 2段目 */}
          <Tr>
            {STATUS_LABEL.slice(4).map((label) => {
              return (
                <Td key={label} id={label}>
                  <span className="">{label}</span>
                  <span className="position-relative">
                    <span className="status-value">{status[label]}</span>
                    <span className="status-border-bottom"></span>
                  </span>
                </Td>
              );
            })}
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TabStatus;
