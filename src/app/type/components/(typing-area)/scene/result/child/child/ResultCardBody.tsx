import { TypeResult } from "@/app/type/(ts)/type";
import { ThemeColors } from "@/types";
import { Box, Text, CardBody, Tooltip, useTheme } from "@chakra-ui/react";
import { memo } from "react";

interface ResultCardBodyProps {
  lineKanaWord: string;
  typeResult: TypeResult[];
  lineTypeWord: string;
  lostWord: string;
}

function ResultCardBody({ lineKanaWord, typeResult, lineTypeWord, lostWord }: ResultCardBodyProps) {
  const theme: ThemeColors = useTheme();

  return (
    <CardBody py={0} className="text-md word-font">
      <Box className="kana-word">
        <Box>{lineKanaWord}</Box>
      </Box>
      <Box className="word-result outline-text text-white uppercase ml-1" letterSpacing="0.1em">
        {typeResult.map(
          (type: TypeResult, index: number) =>
            type.c && (
              <Tooltip
                key={index}
                label={`time: ${type.t.toFixed(3)}`}
                placement="top"
                fontSize="sm"
                hasArrow
                bg={theme.colors.popup.bg}
                color={theme.colors.popup.color}
                border="1px solid"
                borderColor={theme.colors.type.card.borderColor}
                css={{
                  "--popper-arrow-bg": theme.colors.popup.bg,
                  "--popper-arrow-shadow-color": theme.colors.type.card.borderColor,
                }}
              >
                <Text
                  as="span"
                  _hover={{ bg: `${theme.colors.type.card.borderColor}70` }}
                  color={
                    type.is
                      ? lostWord === ""
                        ? theme.colors.type.word.completed
                        : theme.colors.type.word.correct
                      : theme.colors.type.word.error
                  }
                >
                  {type.c.replace(/ /g, "ˍ")}
                </Text>
              </Tooltip>
            ),
        )}
        <Text as="span" wordBreak="break-all">
          {lostWord !== null ? lostWord : lineTypeWord}
        </Text>
      </Box>
    </CardBody>
  );
}

export default memo(ResultCardBody);
