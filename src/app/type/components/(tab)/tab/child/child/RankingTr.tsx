"use client";

import { useRefs } from "@/app/type/(contexts)/refsProvider";
import { Box, Td, Tooltip, Tr } from "@chakra-ui/react"; // Boxコンポーネントを追加
import { formatDistanceToNowStrict } from "date-fns";
import { ja } from "date-fns/locale";
import { useEffect } from "react";

interface RankingTrProps {
  sessionUserId: number | undefined;
  rankingUserId: number;
  rank: number;
  name: string;
  score: number;
  type: number;
  kpm: number;
  rkpm: number;
  defaultSpeed: number;
  romaType: number;
  kanaType: number;
  flickType: number;
  miss: number;
  lost: number;
  maxCombo: number;
  updatedAt: string;
  isHighlighted: boolean;
  isHovered: boolean;
  handleShowMenu: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}
const RankingTr = (props: RankingTrProps) => {
  const { gameStateRef } = useRefs();

  useEffect(() => {
    if (props.sessionUserId === props.rankingUserId) {
      gameStateRef.current!.practice.hasMyRankingData = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getInputMode = () => {
    let mode = "";

    if (props.romaType && props.kanaType) {
      if (props.romaType >= props.kanaType) {
        mode = "ローマ字&かな";
      } else {
        mode = "かな&ローマ字";
      }
    } else {
      if (props.romaType) {
        mode = "ローマ字";
      }

      if (props.kanaType) {
        mode = "かな";
      }
    }

    return mode;
  };
  return (
    <Tooltip
      label={
        <Box fontSize="sm">
          {props.romaType > 0 && <div>ローマ字タイプ数: {props.romaType}</div>}
          {props.kanaType > 0 && <div>かな入力タイプ数: {props.kanaType}</div>}
          {props.flickType > 0 && <div>フリック入力タイプ数: {props.flickType}</div>}
          <div>ミス数: {props.miss}</div>
          <div>ロスト数: {props.lost}</div>
          <div>最大コンボ: {props.maxCombo}</div>
          <div>rkpm: {props.rkpm}</div>
          {props.defaultSpeed > 1 && <div>倍速: {props.defaultSpeed.toFixed(2)}x</div>}
          <div>
            日時:{" "}
            {new Date(props.updatedAt).toLocaleString("ja-JP", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </Box>
      }
      hasArrow
      placement="bottom-end"
      isOpen={(props.isHighlighted && window.innerWidth >= 768) || props.isHovered}
    >
      <Tr
        _hover={{ backgroundColor: "gray.100" }}
        backgroundColor={props.isHighlighted ? "gray.100" : "transparent"}
        className={`cursor-pointer ${props.sessionUserId === props.rankingUserId ? "my-result" : ""}`}
        color={
          props.sessionUserId === props.rankingUserId
            ? "type.tab.ranking.myrank.color"
            : "type.tab.ranking.color"
        }
        onClick={props.handleShowMenu}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
      >
        <Td pr={5} className="">{`#${props.rank}`}</Td>
        <Td isTruncated whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          {props.name}
        </Td>
        <Td>{props.score}</Td>
        <Td>{((props.type / (props.miss + props.type)) * 100).toFixed(1) + "%"}</Td>
        <Td>{props.kpm}</Td>
        <Td isTruncated whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          {getInputMode()}
        </Td>
        <Td isTruncated whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          {formatDistanceToNowStrict(new Date(props.updatedAt), { addSuffix: true, locale: ja })}
        </Td>
      </Tr>
    </Tooltip>
  );
};

export default RankingTr;
