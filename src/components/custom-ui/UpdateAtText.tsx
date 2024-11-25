import { Text } from "@chakra-ui/react";
import { formatDistanceToNowStrict } from "date-fns";
import { ja } from "date-fns/locale";
import React from "react";

interface UpdateAtTextProps {
  updatedAt: Date;
}

const UpdateAtText = (props: UpdateAtTextProps) => {
  return (
    <Text as="span" isTruncated whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
      {formatDistanceToNowStrict(new Date(props.updatedAt), { addSuffix: true, locale: ja })}
    </Text>
  );
};

export default UpdateAtText;
