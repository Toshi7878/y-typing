import { ResultCardInfo } from "@/app/timeline/ts/type";
import UpdateAtText from "@/components/UpdateAtText";
import { useLinkClick } from "@/lib/hooks/useLinkClick";
import { ThemeColors } from "@/types";
import { Link } from "@chakra-ui/next-js";
import { Text, useTheme } from "@chakra-ui/react";
import React from "react";

interface ResultUserNameProps {
  result: ResultCardInfo;
}

const ResultUserName = (props: ResultUserNameProps) => {
  const { result } = props;

  const handleLinkClick = useLinkClick();
  const theme: ThemeColors = useTheme();

  return (
    <Text as="span" className="ml-0 md:ml-6">
      <Link
        href={`/user/${result.user.id}`}
        onClick={handleLinkClick}
        color={theme.colors.home.card.link}
        fontWeight="bold"
      >
        {result.user.name}
      </Link>{" "}
      - <UpdateAtText updatedAt={result.updatedAt} />
    </Text>
  );
};

export default ResultUserName;
