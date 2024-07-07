import React, { forwardRef, useEffect, useImperativeHandle } from "react";

import {
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Card,
  CardBody,
  useMediaQuery,
} from "@chakra-ui/react"; // Card, CardBodyを追加

import "../../../style/statusTable.scss";
import { mapAtom, statusAtom, timeBonusAtom } from "@/app/type/(atoms)/gameRenderAtoms";

import { useAtom } from "jotai";
import styled from "@emotion/styled";

export interface TabStatusRef {
  getStatus: () => void;
}

const TabStatus = forwardRef((props, ref) => {
  const [map] = useAtom(mapAtom);
  const [timeBonus] = useAtom(timeBonusAtom);

  const [status, setStatus] = useAtom(statusAtom);
  const [isMdOrSmaller] = useMediaQuery("(max-width: 900px)"); // mdサイズ以下の判定

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

  const STATUS_LABEL = isMdOrSmaller
    ? ["score", "line", "miss", "lost"]
    : ["score", "type", "kpm", "rank", "point", "miss", "lost", "line"];
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
    }

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      width: ${({ label }) => (label === "score" || label === "point" ? "120px" : "70px")};
      background-color: black;
    }
  `;

  const TrStyled = styled(Tr)`
    height: 104px; // 高さを大きく設定
  `;
  return (
    <Card variant={"filled"} bg="blue.100" boxShadow="lg">
      <CardBody>
        <TableContainer>
          <Table variant="unstyled" className="table-fixed overflow-hidden">
            <Tbody className="font-bold text-3xl font-mono">
              {/* 1段目 */}

              <TrStyled>
                {STATUS_LABEL.slice(0, STATUS_LABEL.length / 2).map((label) => {
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
                {STATUS_LABEL.slice(STATUS_LABEL.length / 2).map((label) => {
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
