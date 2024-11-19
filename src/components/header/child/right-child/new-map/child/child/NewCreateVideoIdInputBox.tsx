"use client";

import { Input, Box, UseDisclosureReturn } from "@chakra-ui/react";
import { extractYouTubeVideoId } from "../../extractYTId";
import { Dispatch } from "react";

interface NewCreateVideoIdInputBoxProps {
  newCreateModalDisclosure: UseDisclosureReturn;
  createBtnRef: React.RefObject<HTMLButtonElement>; // 修正: 型を追加
  createYTURL: string;
  setCreateYTURL: Dispatch<string>;
  setNewID: Dispatch<string>;
}

export default function NewCreateVideoIdInputBox(props: NewCreateVideoIdInputBoxProps) {
  return (
    <Box>
      譜面を作成したいYouTube動画のURLを入力
      <Input
        value={props.createYTURL}
        placeholder="YouTube URLを入力"
        onChange={async (event) => {
          props.setCreateYTURL(event.target.value);
          const videoId = extractYouTubeVideoId(event.target.value);
          props.setNewID(videoId);
          if (videoId) {
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            if (props.createBtnRef.current) {
              props.createBtnRef.current.click();
            }
          }
        }}
      />
    </Box>
  );
}
