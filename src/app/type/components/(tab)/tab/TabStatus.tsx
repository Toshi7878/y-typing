import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Card,
  CardBody,
  useMediaQuery,
  Box,
} from "@chakra-ui/react"; // Card, CardBodyを追加

import "../../../style/statusTable.scss";
import { mapAtom, rankingScoresAtom } from "@/app/type/(atoms)/gameRenderAtoms";

import { useAtom } from "jotai";
import styled from "@emotion/styled";
import StatusValue from "./child/child/StatusValue";
import { useRefs } from "@/app/type/(contexts)/refsProvider";
import { Status } from "@/app/type/(ts)/type";
import PointStatusValue from "./child/child/StatusPointValue";
import StatusKpmValue from "./child/child/StatusKpmValue";

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
  const statusKpmValueRef = useRef(null);

  const defaultStatus: Status = {
    score: 0,
    point: 0,
    timeBonus: 0,
    type: 0,
    miss: 0,
    lost: 0,
    rank: rankingScores.length + 1,
    line: map ? map.lineLength : 0,
  };

  const [status, setStatus] = useState(defaultStatus);
  const [isMdOrSmaller] = useMediaQuery("(max-width: 900px)"); // mdサイズ以下の判定

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
      width: ${({ label }) => (label === "score" || label === "point" ? "140px" : "81px")};
      background-color: black;
    }
  `;

  const TrStyled = styled(Tr)<{ isMdOrSmaller: boolean }>`
    height: ${({ isMdOrSmaller }) =>
      isMdOrSmaller ? "52px" : "122px"}; // isMdOrSmallerがtrueのとき高さを小さく設定
  `;
  const TdStyled = styled(Td)<{ isCentered: boolean }>``;

  return (
    <Card variant={"filled"} bg="blue.100" boxShadow="lg">
      <CardBody>
        <TableContainer>
          <Table
            minH={props.height}
            variant="unstyled"
            className="table-fixed overflow-hidden"
            overflowY="auto"
          >
            <Tbody className="font-bold text-2xl 2xl:text-4xl font-mono">
              {/* 1段目 */}

              <TrStyled isMdOrSmaller={isMdOrSmaller}>
                {STATUS_LABEL.slice(0, STATUS_LABEL.length / 2).map((label) => {
                  return (
                    <TdStyled key={label} id={label} isCentered={isMdOrSmaller}>
                      <Label className="label">{capitalizeFirstLetter(label)}</Label>

                      <UnderlinedSpan label={label}>
                        {label === "kpm" ? (
                          <StatusKpmValue ref={statusKpmValueRef} />
                        ) : (
                          <StatusValue value={status[label]} />
                        )}
                      </UnderlinedSpan>
                    </TdStyled>
                  );
                })}
              </TrStyled>

              {/* 2段目 */}

              <TrStyled isMdOrSmaller={isMdOrSmaller}>
                {STATUS_LABEL.slice(STATUS_LABEL.length / 2).map((label) => {
                  return (
                    <TdStyled key={label} id={label} isCentered={isMdOrSmaller}>
                      <Label>{capitalizeFirstLetter(label)}</Label>

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
