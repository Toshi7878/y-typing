import React from "react";

import { Table, Tbody, Tr, Td, TableContainer, Card, CardBody } from "@chakra-ui/react"; // Card, CardBodyを追加

import "../../../style/statusTable.scss";

import { mapAtom, statusAtom } from "@/app/type/(atoms)/gameRenderAtoms";

import { useAtom } from "jotai";
import styled from "@emotion/styled";

const TabStatus = () => {
  const [map] = useAtom(mapAtom);

  const [status] = useAtom(statusAtom);

  if (!map) return null; // mapが存在しない場合は何も表示しない

  const STATUS_LABEL = ["score", "type", "kpm", "rank", "point", "miss", "lost", "line"];
  const capitalizeFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const Label = styled.span`
    position: relative;
    right: 8px;
  `;

  const UnderlinedSpan = styled.span`
    position: relative;
    .value {
      position: relative;
      z-index: 1;
    }
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      width: 50px;
      background-color: black;
      z-index: 0;
    }
  `;
  return (
    <Card variant={"filled"} bg="blue.100">
      <CardBody>
        <TableContainer>
          <Table variant="unstyled">
            <Tbody className="font-bold text-xl">
              {/* 1段目 */}

              <Tr>
                {STATUS_LABEL.slice(0, 4).map((label) => {
                  return (
                    <Td key={label} id={label}>
                      <Label>{capitalizeFirstLetter(label)}</Label>
                      <UnderlinedSpan>
                        <span className="value">{status[label]}</span>
                      </UnderlinedSpan>
                    </Td>
                  );
                })}
              </Tr>

              {/* 2段目 */}

              <Tr>
                {STATUS_LABEL.slice(4).map((label) => {
                  return (
                    <Td key={label} id={label}>
                      <Label>{capitalizeFirstLetter(label)}</Label>

                      <UnderlinedSpan>
                        <span className="value">{status[label]}</span>
                      </UnderlinedSpan>
                    </Td>
                  );
                })}
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
};

export default TabStatus;
