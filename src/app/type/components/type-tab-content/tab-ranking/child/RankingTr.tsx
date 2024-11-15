"use client";

import { useRefs } from "@/app/type/type-contexts/refsProvider";
import ClearRateText from "@/components/user-result-text/ClearRateText";
import CustomToolTip from "@/components/CustomToolTip";
import { UserInputModeText } from "@/components/user-result-text/UserInputModeText";
import { ThemeColors } from "@/types";
import { Td, Tr, useTheme } from "@chakra-ui/react";
import React from "react";
import { useEffect } from "react";
import ResultToolTipText from "@/components/user-result-text/ResultToolTipText";
import UpdateAtText from "@/components/UpdateAtText";

interface RankingTrProps {
  sessionUserId: number | undefined;
  rankingUserId: number;
  rank: number;
  name: string;
  score: number;
  type: number;
  kpm: number;
  rkpm: number;
  romaKpm: number;
  defaultSpeed: number;
  romaType: number;
  kanaType: number;
  flickType: number;
  miss: number;
  lost: number;
  maxCombo: number;
  clearRate: number;
  updatedAt: Date;
  isHighlighted: boolean;
  isHovered: boolean;
  handleShowMenu: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const RankingTr = (props: RankingTrProps) => {
  const { gameStateRef } = useRefs();
  const theme: ThemeColors = useTheme();

  useEffect(() => {
    if (props.sessionUserId === props.rankingUserId) {
      gameStateRef.current!.practice.hasMyRankingData = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isPerfect = props.miss === 0 && props.lost === 0;
  const isKanaFlickTyped = props.kanaType > 0 || props.flickType > 0;
  const correctRate = ((props.type / (props.miss + props.type)) * 100).toFixed(1);

  return (
    <CustomToolTip
      tooltipLabel={
        <ResultToolTipText
          romaType={props.romaType}
          kanaType={props.kanaType}
          flickType={props.flickType}
          miss={props.miss}
          correctRate={correctRate}
          lost={props.lost}
          isPerfect={isPerfect}
          maxCombo={props.maxCombo}
          kpm={props.kpm}
          rkpm={props.rkpm}
          romaKpm={props.romaKpm}
          isKanaFlickTyped={isKanaFlickTyped}
          defaultSpeed={props.defaultSpeed}
          updatedAt={props.updatedAt}
        />
      }
      isOpen={(props.isHighlighted && window.innerWidth >= 768) || props.isHovered}
      placement="bottom-end"
    >
      <Tr
        _hover={{ backgroundColor: theme.colors.card.hover.bg }}
        backgroundColor={props.isHighlighted ? theme.colors.card.hover.bg : "transparent"}
        className={`cursor-pointer ${props.sessionUserId === props.rankingUserId ? "my-result" : ""}`}
        {...(props.sessionUserId === props.rankingUserId && {
          color: theme.colors.type.tab.ranking.myrank.color,
        })}
        onClick={props.handleShowMenu}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
      >
        <Td pr={5} className="">{`#${props.rank}`}</Td>
        <Td isTruncated whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          {props.name}
        </Td>
        <Td>{props.score}</Td>
        <Td>
          <ClearRateText clearRate={props.clearRate} isPerfect={isPerfect} />
        </Td>
        <Td>{props.kpm}</Td>
        <Td>
          <UserInputModeText
            kanaType={props.kanaType}
            romaType={props.romaType}
            flickType={props.flickType}
          />
        </Td>
        <Td>
          <UpdateAtText updatedAt={props.updatedAt} />
        </Td>
        <Td alignItems="center">{0}</Td>
      </Tr>
    </CustomToolTip>
  );
};

export default RankingTr;
