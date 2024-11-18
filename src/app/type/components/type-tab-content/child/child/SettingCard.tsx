import React, { Dispatch, useEffect, useRef } from "react";
import { Card, CardBody, Divider, useTheme } from "@chakra-ui/react";
import { ThemeColors } from "@/types";
import UserTimeOffsetChange from "./child/UserTimeOffsetChange";
import UserNextDisplayRadioButton from "./child/UserNextDisplayRadioButton";
import UserSoundEffectCheckbox from "./child/UserSoundEffectCheckbox";
import VolumeRange from "./child/VolumeRange";
import UserShortcutKeyCheckbox from "./child/UserShortcutKeyCheckbox";

interface SettingCardProps {
  isCardVisible: boolean;
  setIsCardVisible: Dispatch<boolean>;
}

const SettingCard = (props: SettingCardProps) => {
  const theme: ThemeColors = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const isIOS = typeof navigator !== "undefined" && /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            {!isIOS && !isAndroid && <VolumeRange />}
            {!isIOS && !isAndroid && <Divider bg={theme.colors.color} my={3} />}
            <UserTimeOffsetChange />
            <Divider bg={theme.colors.color} my={3} />
            <UserSoundEffectCheckbox />
            <Divider bg={theme.colors.color} my={3} />
            <UserNextDisplayRadioButton />
            <Divider bg={theme.colors.color} my={3} />
            <UserShortcutKeyCheckbox />
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default SettingCard;
