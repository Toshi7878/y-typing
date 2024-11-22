"use client";

import { useRefs } from "@/app/type/type-contexts/refsProvider";
import ClearRateText from "@/components/user-result-text/ClearRateText";
import CustomToolTip from "@/components/custom-chakra-ui/CustomToolTip";
import { UserInputModeText } from "@/components/user-result-text/UserInputModeText";
import { LocalClapState, ThemeColors } from "@/types";
import { Td, Tr, useTheme } from "@chakra-ui/react";
import React, { Dispatch, useOptimistic, useState } from "react";
import { useEffect } from "react";
import ResultToolTipText from "@/components/user-result-text/ResultToolTipText";
import UpdateAtText from "@/components/custom-chakra-ui/UpdateAtText";
import ClapedText from "@/components/user-result-text/ClapedText";
import RankText from "@/components/user-result-text/RankText";
import RankingMenu from "./RankingMenu";
import { RankingListType } from "@/app/type/ts/type";
import { useSession } from "next-auth/react";
import { useLocalClapServerActions } from "@/lib/hooks/useLocalClapServerActions";
import { RANKING_COLUMN_WIDTH } from "@/app/type/ts/const/consts";

interface RankingTrProps {
  result: RankingListType;
  index: number;
  rank: number;
  type: number;
  romaType: number;
  kanaType: number;
  flickType: number;
  isHighlighted: boolean;
  showMenu: number | null;
  setShowMenu: Dispatch<number | null>;
  setHoveredIndex: Dispatch<number | null>;
  isHovered: boolean;
  handleShowMenu: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const RankingTr = (props: RankingTrProps) => {
  const { gameStateRef } = useRefs();
  const theme: ThemeColors = useTheme();
  const { data: session } = useSession();
  const userId = Number(session?.user.id);
  const { clapOptimisticState, toggleClapAction } = useLocalClapServerActions({
    hasClap: props.result.hasClap,
    clapCount: props.result.clapCount,
  });

  useEffect(() => {
    if (userId === props.result.id) {
      gameStateRef.current!.practice.hasMyRankingData = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isPerfect = props.result.miss === 0 && props.result.lost === 0;
  const isKanaFlickTyped = props.kanaType > 0 || props.flickType > 0;
  const correctRate = ((props.type / (props.result.miss + props.type)) * 100).toFixed(1);

  return (
    <>
      <CustomToolTip
        tooltipLabel={
          <ResultToolTipText
            romaType={props.romaType}
            kanaType={props.kanaType}
            flickType={props.flickType}
            miss={props.result.miss}
            correctRate={correctRate}
            lost={props.result.lost}
            isPerfect={isPerfect}
            maxCombo={props.result.maxCombo}
            kpm={props.result.kpm}
            rkpm={props.result.rkpm}
            romaKpm={props.result.romaKpm}
            isKanaFlickTyped={isKanaFlickTyped}
            defaultSpeed={props.result.defaultSpeed}
            updatedAt={props.result.updatedAt}
          />
        }
        isOpen={(props.isHighlighted && window.innerWidth >= 768) || props.isHovered}
        placement="bottom-end"
      >
        <Tr
          _hover={{ backgroundColor: theme.colors.button.sub.hover }}
          backgroundColor={props.isHighlighted ? theme.colors.button.sub.hover : "transparent"}
          className={`cursor-pointer ${userId === Number(props.result.userId) ? "my-result" : ""}`}
          {...(userId === Number(props.result.userId) && {
            color: theme.colors.secondary.main,
          })}
          onClick={props.handleShowMenu}
          onMouseEnter={props.onMouseEnter}
          onMouseLeave={props.onMouseLeave}
        >
          <Td width={RANKING_COLUMN_WIDTH.rank}>
            <RankText rank={props.rank}>{`#${props.rank}`}</RankText>
          </Td>
          <Td width={RANKING_COLUMN_WIDTH.score}>{props.result.score}</Td>
          <Td width={RANKING_COLUMN_WIDTH.clearRate}>
            <ClearRateText clearRate={props.result.clearRate} isPerfect={isPerfect} />
          </Td>
          <Td
            width={RANKING_COLUMN_WIDTH.userName}
            isTruncated
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {props.result.user.name}
          </Td>

          <Td width={RANKING_COLUMN_WIDTH.kpm}>{props.result.kpm}</Td>
          <Td width={RANKING_COLUMN_WIDTH.inputMode}>
            <UserInputModeText
              kanaType={props.kanaType}
              romaType={props.romaType}
              flickType={props.flickType}
            />
          </Td>
          <Td width={RANKING_COLUMN_WIDTH.updatedAt}>
            <UpdateAtText updatedAt={props.result.updatedAt} />
          </Td>
          <Td width={RANKING_COLUMN_WIDTH.clapCount} alignItems="center">
            <ClapedText clapOptimisticState={clapOptimisticState} />
          </Td>
        </Tr>
      </CustomToolTip>
      {props.showMenu === props.index && (
        <RankingMenu
          resultId={props.result.id}
          userId={Number(props.result.userId)}
          name={props.result.user.name}
          setShowMenu={props.setShowMenu}
          setHoveredIndex={props.setHoveredIndex}
          clapOptimisticState={clapOptimisticState}
          toggleClapAction={toggleClapAction}
        />
      )}
    </>
  );
};

export default RankingTr;
