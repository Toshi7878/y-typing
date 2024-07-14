"use client";

import { Td, Tooltip, Tr } from "@chakra-ui/react"; // Boxコンポーネントを追加

interface RankingTrProps {
  rank: number;
  name: string;
  score: number;
  type: number;
  kpm: number;
  handleShowMenu: () => void;
  romaType: number;
  kanaType: number;
  flickType: number;
  miss: number;
  lost: number;
  maxCombo: number;
  isHighlighted: boolean; // 変更
  isHovered: boolean; // 追加
  onMouseEnter: () => void; // 追加
  onMouseLeave: () => void; // 追加
}
const RankingTr = (props: RankingTrProps) => {
  const getInputMode = () => {
    let mode = "";

    if (props.romaType && props.kanaType) {
      if (props.romaType >= props.kanaType) {
        mode = "ローマ字 & かな";
      } else {
        mode = "かな & ローマ字";
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
        <div>
          {props.romaType > 0 && <div>ローマ字タイプ数: {props.romaType}</div>}
          {props.kanaType > 0 && <div>かな入力タイプ数: {props.kanaType}</div>}
          {props.flickType > 0 && <div>フリック入力タイプ数: {props.flickType}</div>}
          <div>ミス数: {props.miss}</div>
          <div>ロスト数: {props.lost}</div>
          <div>最大コンボ: {props.maxCombo}</div>
        </div>
      }
      hasArrow
      placement="bottom"
      isOpen={props.isHighlighted || props.isHovered} // 変更
    >
      <Tr
        _hover={{ backgroundColor: "gray.100" }}
        backgroundColor={props.isHighlighted ? "gray.100" : "transparent"} // 変更
        className="cursor-pointer"
        onClick={props.handleShowMenu}
        onMouseEnter={props.onMouseEnter} // 追加
        onMouseLeave={props.onMouseLeave} // 追加
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
      </Tr>
    </Tooltip>
  );
};

export default RankingTr;
