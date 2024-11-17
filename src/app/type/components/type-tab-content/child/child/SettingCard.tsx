import React, { Dispatch, useEffect, useRef, useState } from "react";
import { Card, CardBody, useTheme } from "@chakra-ui/react";

import { ThemeColors } from "@/types";
import UserTimeOffsetChange from "./child/EditSpeedChange";

interface SettingCardProps {
  isCardVisible: boolean;
  setIsCardVisible: Dispatch<boolean>;
}

const SettingCard = (props: SettingCardProps) => {
  const theme: ThemeColors = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.parentElement?.id !== "option_icon" &&
        cardRef.current &&
        !cardRef.current.contains(target)
      ) {
        props.setIsCardVisible(false);
      }
    };

    if (props.isCardVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [props.isCardVisible]);

  return (
    <>
      {props.isCardVisible && (
        <Card
          ref={cardRef}
          position="absolute"
          zIndex={4}
          width={"600px"}
          bg={theme.colors.popup.bg}
          color={theme.colors.popup.color}
          border="1px"
          top={10}
          right={0}
          borderColor={theme.colors.card.borderColor}
        >
          <CardBody>
            <UserTimeOffsetChange />
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default SettingCard;
