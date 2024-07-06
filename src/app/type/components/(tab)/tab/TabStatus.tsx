import React, { forwardRef, useEffect, useImperativeHandle } from "react";

import { Table, Tbody, Tr, Td, TableContainer, Card, CardBody } from "@chakra-ui/react"; // Card, CardBodyを追加

import "../../../style/statusTable.scss";
import { mapAtom, statusAtom, timeBonusAtom } from "@/app/type/(atoms)/gameRenderAtoms";

import { useAtom } from "jotai";
import styled from "@emotion/styled";
import { useRefs } from "@/app/edit/(contexts)/refsProvider";

export interface TabStatusRef {
  getStatus: () => void;
}

const TabStatus = forwardRef((props, ref) => {
  const [map] = useAtom(mapAtom);
  const [timeBonus] = useAtom(timeBonusAtom);

  const [status, setStatus] = useAtom(statusAtom);

  useImperativeHandle(ref, () => ({
    getStatus: () => status,
  }));

  useEffect(() => {
    if (map) {
      const newStatus = { ...status };
      newStatus.line = map.lineLength;

      setStatus(newStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  if (!map) return null; // mapが存在しない場合は何も表示しない

  const STATUS_LABEL = ["score", "type", "kpm", "rank", "point", "miss", "lost", "line"];
  const capitalizeFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const Label = styled.span`
    position: relative;
    right: 8px;
  `;

  const UnderlinedSpan = styled.span<{ label: string }>`
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
      width: ${({ label }) => (label === "score" || label === "point" ? "120px" : "70px")};

      background-color: black;

      z-index: 0;
    }
  `;

  const TrStyled = styled(Tr)`
    height: 102px; // 高さを大きく設定
  `;
  return (
    <Card variant={"filled"} bg="blue.100">
      <CardBody>
        <TableContainer>
          <Table variant="unstyled" className="table-fixed">
            <Tbody className="font-bold text-3xl font-mono">
              {/* 1段目 */}

              <TrStyled>
                {STATUS_LABEL.slice(0, 4).map((label) => {
                  return (
                    <Td
                      key={label}
                      id={label}
                      className={label === "rank" && status["rank"] === 0 ? " opacity-45" : ""}
                    >
                      <Label className="label">{capitalizeFirstLetter(label)}</Label>

                      <UnderlinedSpan label={label}>
                        <span className="value">{status[label]}</span>
                      </UnderlinedSpan>
                    </Td>
                  );
                })}
              </TrStyled>

              {/* 2段目 */}

              <TrStyled>
                {STATUS_LABEL.slice(4).map((label) => {
                  return (
                    <Td key={label} id={label}>
                      <Label>{capitalizeFirstLetter(label)}</Label>

                      <UnderlinedSpan label={label}>
                        <span className="value">
                          {label === "point" && timeBonus
                            ? `${status[label]}+${timeBonus}`
                            : status[label]}
                        </span>
                      </UnderlinedSpan>
                    </Td>
                  );
                })}
              </TrStyled>
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
});

TabStatus.displayName = "TabStatus";

export default TabStatus;
