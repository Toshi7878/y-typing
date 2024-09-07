"use client";

import { useRefs } from "@/app/type/type-contexts/refsProvider";
import CustomToolTip from "@/components/CustomToolTip";
import { ThemeColors } from "@/types";
import { Box, Td, Text, Tooltip, Tr, useTheme } from "@chakra-ui/react"; // Boxコンポーネントを追加
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
  romaKpm: number;
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
  const theme: ThemeColors = useTheme();

  useEffect(() => {
    if (props.sessionUserId === props.rankingUserId) {
      gameStateRef.current!.practice.hasMyRankingData = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const romaColor = theme.colors.type.ready.radio.roma.bg;
  const kanaColor = theme.colors.type.ready.radio.kana.bg;
  const flickColor = theme.colors.type.ready.radio.flick.bg;

  const isPerfect = props.miss === 0 && props.lost === 0;
  const isKanaFlickTyped = props.kanaType > 0 || props.flickType > 0;
  const getInputMode = () => {
    if (props.romaType && props.kanaType) {
      if (props.romaType >= props.kanaType) {
        return (
          <>
            <Text as="span" color={romaColor} className="input-mode-outline-text">
              ローマ字
            </Text>
            <Text as="span" color={theme.colors.card.color}>
              ・
            </Text>
            <Text as="span" color={kanaColor} className="input-mode-outline-text">
              かな
            </Text>
          </>
        );
      } else {
        return (
          <>
            <Text as="span" color={kanaColor} className="input-mode-outline-text">
              かな
            </Text>
            <Text as="span" color={theme.colors.card.color}>
              ・
            </Text>
            <Text as="span" color={romaColor} className="input-mode-outline-text">
              ローマ字
            </Text>
          </>
        );
      }
    } else {
      if (props.romaType) {
        return (
          <Text as="span" color={romaColor} className="input-mode-outline-text">
            ローマ字
          </Text>
        );
      }
      if (props.kanaType) {
        return (
          <Text as="span" color={kanaColor} className="input-mode-outline-text">
            かな
          </Text>
        );
      }
    }
    return null;
  };
  return (
    <CustomToolTip
      tooltipLabel={
        <Box fontSize="sm">
          {props.romaType > 0 && (
            <Box>
              <Text as="span">ローマ字タイプ数</Text>:{" "}
              <Text as="span" fontSize="md" fontWeight="bold">
                {props.romaType}
              </Text>
            </Box>
          )}
          {props.kanaType > 0 && (
            <Box>
              <Text as="span">かな入力タイプ数</Text>:{" "}
              <Text as="span" fontSize="md" fontWeight="bold">
                {props.kanaType}
              </Text>
            </Box>
          )}
          {props.flickType > 0 && (
            <Box>
              <Text as="span">フリック入力タイプ数</Text>:{" "}
              <Text as="span" fontSize="md" fontWeight="bold">
                {props.flickType}
              </Text>
            </Box>
          )}
          <Box>
            ミス数:{" "}
            <Text as="span" fontSize="md" fontWeight="bold">
              {props.miss}
            </Text>
          </Box>
          <Box>
            ロスト数:{" "}
            <Text as="span" fontSize="md" fontWeight="bold">
              {props.lost}
            </Text>
          </Box>
          <Box>
            最大コンボ:{" "}
            <Text
              as="span"
              {...(isPerfect && { color: theme.colors.type.tab.ranking.perfect.color })}
              className={`${isPerfect ? "outline-text" : ""}`}
              fontSize="md"
              fontWeight="bold"
            >
              {props.maxCombo}
            </Text>
          </Box>
          <Box>
            rkpm:{" "}
            <Text as="span" fontSize="md" fontWeight="bold">
              {props.rkpm}
            </Text>
          </Box>
          {isKanaFlickTyped && props.kpm !== props.romaKpm && (
            <Box>
              <Text as="span">ローマ字換算kpm</Text>:{" "}
              <Text as="span" fontSize="md" fontWeight="bold">
                {props.romaKpm}
              </Text>
            </Box>
          )}
          {props.defaultSpeed > 1 && (
            <Box>
              倍速:{" "}
              <Text as="span" fontSize="md" fontWeight="bold">
                {props.defaultSpeed.toFixed(2)}x
              </Text>
            </Box>
          )}
          <Box>
            日時:{" "}
            <Text as="span" fontSize="md">
              {new Date(props.updatedAt).toLocaleString("ja-JP", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </Box>
        </Box>
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
        <Td
          {...(isPerfect && { color: theme.colors.type.tab.ranking.perfect.color })}
          className={`${isPerfect ? "outline-text" : ""}`}
        >
          {((props.type / (props.miss + props.type)) * 100).toFixed(1) + "%"}
        </Td>
        <Td>{props.kpm}</Td>
        <Td isTruncated whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          {getInputMode()}
        </Td>
        <Td isTruncated whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          {formatDistanceToNowStrict(new Date(props.updatedAt), { addSuffix: true, locale: ja })}
        </Td>
      </Tr>
    </CustomToolTip>
  );
};

export default RankingTr;
