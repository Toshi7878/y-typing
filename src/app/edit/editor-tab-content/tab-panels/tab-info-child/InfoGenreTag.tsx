import { useEffect, useState } from "react";

import { Box, Flex, Stack, Badge } from "@chakra-ui/react";

import { WithContext as ReactTags, SEPARATORS } from "react-tag-input";

import "@/app/edit/style/reactTags.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/edit/redux/store";
import { deleteTags, setTags } from "@/app/edit/redux/GenreTagSlice";
import { setCanUpload } from "@/app/edit/redux/buttonFlagsSlice";
import { useRefs } from "@/app/edit/edit-contexts/refsProvider";
import { Tag } from "@/types";

const InfoGenreTag = () => {
  const { tags } = useSelector((state: RootState) => state.genreTag);
  const dispatch = useDispatch();
  const { playerRef } = useRefs();
  const [ytTitle, setYtTitle] = useState("動画タイトル");
  const isReady = useSelector((state: RootState) => state.ytState.isReady);

  useEffect(() => {
    if (playerRef.current) {
      setYtTitle(playerRef.current.getVideoData().title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  const suggestions = [
    { id: "1", text: "公式MV", className: "" },
    { id: "2", text: "英語", className: "" },
    // 他の提案タグを追加
  ];

  const toggleBadge = (label: string) => {
    dispatch(setCanUpload(true));
  };

  const handleDelete = (index: number) => {
    dispatch(setCanUpload(true));
    dispatch(deleteTags(tags.filter((_, i) => i !== index)));
  };

  const handleAddition = (tag: Tag) => {
    tag.id = tag.id.trim();
    tag.text = tag.text.trim();

    const isTagAdded = tags.some((tags) => tags.id === tag.id);

    if (!isTagAdded) {
      dispatch(setCanUpload(true));
      dispatch(setTags(tag));
    }
  };

  const TAG_MAX_LEN = 10;
  const TAG_MIN_LEN = 2;

  return (
    <Box display="flex" flexDirection="column" gap="5">
      <Box fontWeight="bold">
        <span>
          {tags.length}
          {tags.length <= 1 ? `/${TAG_MIN_LEN}` : `/${TAG_MAX_LEN}`} タグ
        </span>
      </Box>

      <div
        {...(tags.length !== 0
          ? {
              onDrop: (event) => {
                if (tags.length < TAG_MAX_LEN) {
                  const text = event.dataTransfer.getData("text").replace(/\s/g, "");
                  handleAddition({ id: text, text: text, className: "" });
                }
              },
            }
          : {})}
      >
        <ReactTags
          tags={tags}
          suggestions={suggestions}
          separators={[SEPARATORS.ENTER, SEPARATORS.COMMA]}
          placeholder={`${tags.length <= 1 ? "タグを2つ以上追加してください" : `タグを追加`}`}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          allowUnique
          allowDragDrop={false}
          inputFieldPosition="inline"
          maxTags={TAG_MAX_LEN}
          handleInputChange={(value, event) => {
            //@ts-ignore
            if (event.nativeEvent.inputType === "insertFromDrop") {
              if (tags.length < TAG_MAX_LEN) {
                handleAddition({ id: value, text: value, className: "" });
                event.target.value = "";
              }
            }
          }}
          inline={false}
        />
      </div>
      <Flex direction="column" wrap="wrap">
        <Stack direction="row" spacing={3} wrap="wrap">
          {[
            "公式動画",
            "Cover/歌ってみた",
            "J-POP",
            "ボーカロイド/ボカロ",
            "東方ボーカル",
            "洋楽",
            "Vtuber",
            "アニメ",
            "ゲーム",
            "英語",
            "英語&日本語",
            "多言語",
            "ラップ",
            "同人音楽",
            "フリー音源",
            "初音ミク",
            "ロック",
            "セリフ読み",
            "Nightcore",
            "キッズ&ファミリー",
            "映画",
            "MAD",
            "Remix",
            "音ゲー",
            "電波ソング",
            "簡単",
            "難しい",
            "装飾譜面",
            "ギミック譜面",
            "YouTube Premium",
          ].map((label, index) => {
            const isSelected = tags.some((tag) => tag.id === label);

            if (isSelected) {
              return "";
            } else {
              return (
                <Badge
                  key={index}
                  variant="solid"
                  colorScheme="teal"
                  bg={`teal.400`}
                  opacity="0.7"
                  className={`cursor-pointer text-sm rounded-lg`}
                  _hover={{ opacity: "1" }}
                  textTransform="none" // 追加: UpperCaseを解除
                  onClick={() => {
                    if (tags.length < TAG_MAX_LEN) {
                      handleAddition({ id: label, text: label, className: "" });
                    }
                  }}
                >
                  {label}
                </Badge>
              );
            }
          })}
        </Stack>
        <small>
          <span className="font-bold">{ytTitle}</span> ← ドラッグ用
          (曲名・アーティスト・アニメ名などをタグに追加すると、見つけやすくなります)
        </small>
      </Flex>
    </Box>
  );
};

export default InfoGenreTag;
