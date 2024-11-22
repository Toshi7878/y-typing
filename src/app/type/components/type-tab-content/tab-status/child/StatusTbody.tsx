import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { Tbody, Tr, Td, useTheme } from "@chakra-ui/react"; // Card, CardBodyを追加
import { useMapAtom, useRankingScoresAtom } from "@/app/type/type-atoms/gameRenderAtoms";
import styled from "@emotion/styled";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import { ThemeColors } from "@/types";
import { Status } from "@/app/type/ts/type";
import StatusValue from "./child/StatusValue";
import StatusPointValue from "./child/StatusPointValue";
import { DEFAULT_STATUS, STATUS_LABEL } from "@/app/type/ts/const/consts";

export interface TabStatusRef {
  getStatus: () => Status;
  setStatus: (newStatus: Status) => void;
  resetStatus: () => void;
}

const StatusTbody = forwardRef((props, ref) => {
  const map = useMapAtom();
  const rankingScores = useRankingScoresAtom();
  const theme: ThemeColors = useTheme();
  const { setRef } = useRefs();
  const [status, setStatus] = useState(DEFAULT_STATUS);

  useEffect(() => {
    if (ref && "current" in ref) {
      setRef("tabStatusRef", ref.current!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useImperativeHandle(ref, () => ({
    getStatus: () => status,
    setStatus: (newStatus: Status) => setStatus(newStatus),
    resetStatus: () => setStatus(structuredClone(DEFAULT_STATUS)),
  }));

  const capitalizeFirstLetter = useCallback((string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }, []);

  useEffect(() => {
    if (map) {
      const newStatus = { ...status };
      newStatus.line = map.lineLength;
      DEFAULT_STATUS.line = map.lineLength;
      setStatus(newStatus);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  useEffect(() => {
    if (rankingScores.length) {
      const newStatus = { ...status };

      newStatus.rank = rankingScores.length + 1;
      DEFAULT_STATUS.rank = rankingScores.length + 1;
      setStatus(newStatus);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rankingScores]);

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
      width: ${({ label }) => (label === "score" || label === "point" ? "159px" : "80px")};
      background-color: ${theme.colors.text.body};
    }
  `;

  const TdStyled = styled(Td)<{ id: string }>`
    width: ${({ id }) => (id === "score" || id === "point" ? "20%" : "14%")};
  `;

  return (
    <Tbody fontSize={"2rem"} fontWeight="bold" fontFamily="mono">
      {/* 1段目 */}

      <Tr>
        {STATUS_LABEL.slice(0, STATUS_LABEL.length / 2).map((label) => {
          return (
            <TdStyled key={label} id={label}>
              <Label label={label} className="label">
                {capitalizeFirstLetter(label)}
              </Label>

              <UnderlinedSpan label={label} className="status-underline">
                <StatusValue value={status[label]} />
              </UnderlinedSpan>
            </TdStyled>
          );
        })}
      </Tr>

      {/* 2段目 */}

      <Tr>
        {STATUS_LABEL.slice(STATUS_LABEL.length / 2).map((label) => {
          return (
            <TdStyled key={label} id={label}>
              <Label label={label}>{capitalizeFirstLetter(label)}</Label>

              <UnderlinedSpan label={label} className="status-underline">
                {label === "point" ? (
                  <StatusPointValue value={status[label]} timeBonusValue={status["timeBonus"]} />
                ) : (
                  <StatusValue value={status[label]} />
                )}
              </UnderlinedSpan>
            </TdStyled>
          );
        })}
      </Tr>
    </Tbody>
  );
});

StatusTbody.displayName = "StatusTr";

export default StatusTbody;
