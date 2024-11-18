import React, { Dispatch, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardBody,
  Checkbox,
  CheckboxGroup,
  Divider,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useTheme,
} from "@chakra-ui/react";

import { ThemeColors } from "@/types";
import UserTimeOffsetChange from "./child/UserTimeOffsetChange";
import UserNextDisplayRadioButton from "./child/UserNextDisplayRadioButton";

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
            <Divider bg={theme.colors.color} my={3} />
            <Flex>
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={2}>
                  効果音
                </Text>
                <CheckboxGroup>
                  <Checkbox ml={2} mr={2}>
                    タイプ音
                  </Checkbox>
                  <Checkbox ml={2} mr={2}>
                    ミス音
                  </Checkbox>
                  <Checkbox ml={2} mr={2}>
                    打ち切り音
                  </Checkbox>
                </CheckboxGroup>
              </Box>
            </Flex>
            <Divider bg={theme.colors.color} my={3} />
            <UserNextDisplayRadioButton />
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default SettingCard;
