import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";

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

import { mapAtom, rankingScoresAtom } from "@/app/type/(atoms)/gameRenderAtoms";

import { useAtom } from "jotai";
import styled from "@emotion/styled";
import StatusValue from "./child/child/StatusValue";
import { useRefs } from "@/app/type/(contexts)/refsProvider";
import { Status } from "@/app/type/(ts)/type";
import PointStatusValue from "./child/child/StatusPointValue";

export interface TabStatusRef {
  getStatus: () => Status;
  setStatus: (newStatus: Status) => void;
  resetStatus: () => void;
}

interface TabStatusProps {
  height: string;
}

const TabStatus = forwardRef((props: TabStatusProps, ref) => {
  const [map] = useAtom(mapAtom);
  const [rankingScores] = useAtom(rankingScoresAtom);

  const { setRef } = useRefs();

  const defaultStatus: Status = {
    score: 0,
    point: 0,
    timeBonus: 0,
    type: 0,
    miss: 0,
    lost: 0,
    kpm: 0,
    rank: rankingScores.length + 1,
    line: map ? map.lineLength : 0,
  };

  const [status, setStatus] = useState(defaultStatus);

  useEffect(() => {
    if (ref && "current" in ref) {
      setRef("tabStatusRef", ref.current!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useImperativeHandle(ref, () => ({
    getStatus: () => status,
    setStatus: (newStatus: Status) => setStatus(newStatus),
    resetStatus: () => setStatus(structuredClone(defaultStatus)),
  }));

  useEffect(() => {
    if (map) {
      const newStatus = { ...status };

      newStatus.line = map.lineLength;
      setStatus(newStatus);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  useEffect(() => {
    if (rankingScores.length) {
      const newStatus = { ...status };

      newStatus.rank = rankingScores.length + 1;
      setStatus(newStatus);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rankingScores]);

  if (!map) return null; // mapが存在しない場合は何も表示しない

  const STATUS_LABEL = [
    ["score", "type", "kpm", "rank"],
    ["point", "miss", "lost", "line"],
  ].flat();
  const capitalizeFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const Label = styled.span<{ label: string }>`
    position: relative;
    right: 8px;
    font-size: 80%;
    ${({ label }) => label === "kpm" && `letter-spacing: 0.2em;`}
  `;

  const UnderlinedSpan = styled.span<{ label: string }>`
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      width: ${({ label }) => (label === "score" || label === "point" ? "140px" : "80px")};
      background-color: black;
    }
  `;

  const TrStyled = styled(Tr)``;
  const TdStyled = styled(Td)<{ id: string }>`
    width: ${({ id }) => (id === "score" || id === "point" ? "20%" : "15%")};
  `;

  return (
    <Card variant={"filled"} bg="blue.100" boxShadow="lg">
      <CardBody className="">
        <TableContainer>
          <Table
            minH={props.height}
            variant="unstyled"
            className="table-fixed overflow-hidden"
            overflowY="auto"
          >
            <Tbody className="font-bold text-[2rem] font-mono">
              {/* 1段目 */}

              <TrStyled>
                {STATUS_LABEL.slice(0, STATUS_LABEL.length / 2).map((label) => {
                  return (
                    <TdStyled key={label} id={label}>
                      <Label label={label} className="label">
                        {capitalizeFirstLetter(label)}
                      </Label>

                      <UnderlinedSpan label={label}>
                        <StatusValue value={status[label]} />
                      </UnderlinedSpan>
                    </TdStyled>
                  );
                })}
              </TrStyled>

              {/* 2段目 */}

              <TrStyled>
                {STATUS_LABEL.slice(STATUS_LABEL.length / 2).map((label) => {
                  return (
                    <TdStyled key={label} id={label}>
                      <Label label={label}>{capitalizeFirstLetter(label)}</Label>

                      <UnderlinedSpan label={label}>
                        {label === "point" ? (
                          <PointStatusValue
                            value={status[label]}
                            timeBonusValue={status["timeBonus"]}
                          />
                        ) : (
                          <StatusValue value={status[label]} />
                        )}
                      </UnderlinedSpan>
                    </TdStyled>
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
