import { Box, Flex, Stack, Text, FormLabel } from "@chakra-ui/react";

import { WithContext as ReactTags, SEPARATORS } from "react-tag-input";

import "@/app/edit/style/reactTags.scss";
import { Tag } from "@/types";
import {
  useGeminiTagsAtom,
  useSetCanUploadAtom,
  useSetTagsAtom,
  useTagsAtom,
} from "@/app/edit/edit-atom/editAtom";
import { CHOICE_TAGS, TAG_MAX_LEN, TAG_MIN_LEN } from "@/app/edit/ts/const/editDefaultValues";
import TagBadge from "./child/TagBadge";

const InfoGenreTag = () => {
  const tags = useTagsAtom();
  const geminiTags = useGeminiTagsAtom();
  const setTags = useSetTagsAtom();
  const setCanUpload = useSetCanUploadAtom();

  const suggestions = [
    { id: "1", text: "公式MV", className: "" },
    { id: "2", text: "英語", className: "" },
    // 他の提案タグを追加
  ];

  const handleDelete = (index: number) => {
    setCanUpload(true);
    const deleteTag = tags[index];
    setTags({ type: "delete", payload: deleteTag });
  };

  const handleAddition = (tag: Tag) => {
    tag.id = tag.id.trim();
    tag.text = tag.text.trim();

    const isTagAdded = tags.some((tags) => tags.id === tag.id);

    if (!isTagAdded) {
      setCanUpload(true);
      setTags({ type: "add", payload: tag });
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap="5">
      <Flex
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
        alignItems="center" // 追加: Flexアイテムを中央揃え
      >
        <FormLabel mb="0" width="150px" fontWeight="bold">
          <Text as="span">
            タグ {tags.length}
            {tags.length <= 1 ? `/${TAG_MIN_LEN}` : `/${TAG_MAX_LEN}`}
          </Text>
        </FormLabel>
        <Box width={"100%"}>
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
        </Box>
      </Flex>
      <Flex direction="column" wrap="wrap">
        <Stack direction="row" spacing={3} wrap="wrap">
          {CHOICE_TAGS.map((label, index) => {
            const isSelected = tags.some((tag) => tag.id === label);

            if (isSelected) {
              return "";
            } else {
              return <TagBadge key={index} label={label} bg="teal.400" />;
            }
          })}
        </Stack>
      </Flex>
      <Flex direction="column" wrap="wrap">
        <Stack direction="row" spacing={3} wrap="wrap">
          {geminiTags.map((label, index) => {
            const isSelected = tags.some((tag) => tag.id === label);

            if (isSelected) {
              return "";
            } else {
              return <TagBadge key={index} label={label} bg="cyan.400" />;
            }
          })}
        </Stack>
      </Flex>
    </Box>
  );
};

export default InfoGenreTag;
