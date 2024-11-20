"use client";

import { Button, Box, useTheme, UseDisclosureReturn } from "@chakra-ui/react";
import { ThemeColors } from "@/types";
import CustomToolTip from "@/components/custom-chakra-ui/CustomToolTip";

import { Link } from "@chakra-ui/next-js";
import { useLinkClick } from "@/lib/hooks/useLinkClick";
import { CreateMapBackUpInfo } from "@/lib/global-types";

interface CreateMapBackUpButtonProps {
  createMapBackUpInfo: CreateMapBackUpInfo;
  newCreateModalDisclosure: UseDisclosureReturn;
}

export default function CreateMapBackUpButton(props: CreateMapBackUpButtonProps) {
  const theme: ThemeColors = useTheme();
  const handleLinkClick = useLinkClick();

  return (
    <CustomToolTip
      tooltipLabel={
        <Box>
          <Box>タイトル: {props.createMapBackUpInfo.title}</Box>
          <Box>YouTubeId: {props.createMapBackUpInfo.videoId}</Box>
        </Box>
      }
      placement="top"
      fontSize="sm"
      isDisabled={props.createMapBackUpInfo.title ? false : true}
    >
      <Link
        fontSize="sm"
        href={`/edit?new=${props.createMapBackUpInfo.videoId}&backup=true`}
        onClick={(event) => {
          handleLinkClick(event);
          props.newCreateModalDisclosure.onClose();
        }}
        visibility={props.createMapBackUpInfo.videoId ? "visible" : "hidden"}
      >
        <Button
          variant="outline"
          size="xs"
          p={4}
          color={`${theme.colors.text.body}`}
          borderColor={`${theme.colors.border.card}50`}
          _hover={{ bg: theme.colors.button.sub.hover }}
        >
          前回のバックアップデータが存在します。
        </Button>
      </Link>
    </CustomToolTip>
  );
}
