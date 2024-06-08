import { useEffect, useState } from "react";

import { Input, Box, Flex, Button, Stack, Badge } from "@chakra-ui/react";

import { WithContext as ReactTags, SEPARATORS } from "react-tag-input";

import { Tag } from "react-tag-input";
import "./(style)/reactTags.scss";
import { RootState } from "../(redux)/store";
import { useSelector } from "react-redux";

const UploadTab = () => {
  const [genre, setGenre] = useState("");
  const ytTitle = useSelector((state: RootState) => state.ytTitle.title);

  const [tags, setTags] = useState<Array<Tag>>([]);
  const suggestions = [
    { id: "1", text: "公式MV", className: "" },
    { id: "2", text: "英語", className: "" },
    // 他の提案タグを追加
  ];

  const toggleBadge = (label: string) => {
    setGenre(label);
  };

  const handleDelete = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleAddition = (tag: Tag) => {
    tag.id = tag.id.replace(/\s/g, "");
    tag.text = tag.text.replace(/\s/g, "");

    const isTagAdded = tags.some((tags) => tags.id === tag.id);

    if (!isTagAdded) {
      setTags((prevTags) => {
        return [...prevTags, tag];
      });
    }
  };

  const TAG_MAX_LEN = 10;
  return (
    <Box display="flex" flexDirection="column" gap="4">
      <Box>
        {tags.length}
        {tags.length <= 1 ? "/2" : `/${TAG_MAX_LEN}`} タグ, <span>{genre ? 1 : 0}/1 ジャンル</span>
      </Box>

      <Flex>
        <Stack direction="row" spacing={4} wrap="wrap">
          {["J-POP", "ボーカロイド", "ゲーム", "アニメ", "Vtuber", "東方ボーカル", "洋楽", "その他"].map((label, index) => {
            const colors = ["blue", "cyan", "purple", "orange", "green", "red", "pink", "gray"];

            const isSelected = genre.includes(label);

            return (
              <Badge
                key={index}
                variant="solid"
                colorScheme={colors[index]}
                bg={`${colors[index]}.400`}
                px="1"
                border="1px"
                borderColor="black"
                opacity={isSelected ? "1" : "0.6"}
                transform={isSelected ? "scale(1.05)" : "scale(1)"}
                className={`${isSelected ? "" : "cursor-pointer"} text-xl rounded-lg`}
                _hover={{ opacity: "1" }}
                onClick={() => toggleBadge(label)}
                textTransform="none" // 追加: UpperCaseを解除
              >
                {label}
              </Badge>
            );
          })}
        </Stack>
      </Flex>

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
          placeholder="タグを追加"
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
        />
      </div>

      <Flex direction="column" wrap="wrap">
        <Stack direction="row" spacing={3} wrap="wrap">
          {[
            "公式MV",
            "英語",
            "多言語",
            "ラップ",
            "同人音楽",
            "インディー",
            "Nightcore",
            "キッズ＆ファミリー",
            "映画",
            "MAD",
            "Remix",
            "音ゲー",
            "電波ソング",
            "簡単",
            "難しい",
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
                  opacity="0.8"
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
        <small>{ytTitle} ← ドラッグ用</small>
      </Flex>

      <Button
        disabled={genre === "" || tags.length >= 2}
        variant="solid"
        size="lg"
        colorScheme="blue"
        width="200px"
        border="1px"
        borderColor="black"
        _hover={{ bg: "#3a90f3" }}
        opacity={genre === "" || tags.length <= 1 ? "0.6" : "1"}
        onClick={() => {}}
      >
        保存
      </Button>
    </Box>
  );
};

export default UploadTab;
