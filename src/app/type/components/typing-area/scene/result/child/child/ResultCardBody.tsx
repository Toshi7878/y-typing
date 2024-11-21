import { TypeResult } from "@/app/type/ts/type";
import CustomToolTip from "@/components/custom-chakra-ui/CustomToolTip";
import { ThemeColors } from "@/types";
import { Box, Text, useTheme } from "@chakra-ui/react";
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
    <>
      <Box className="kana-word">
        <Box>{lineKanaWord}</Box>
      </Box>
      <Box className="word-result outline-text text-white uppercase ml-1" letterSpacing="0.1em">
        {typeResult.map(
          (type: TypeResult, index: number) =>
            type.c && (
              <CustomToolTip
                key={index}
                tooltipLabel={`time: ${type.t.toFixed(3)}`}
                placement="top"
                fontSize="sm"
              >
                <Text
                  as="span"
                  className="typed"
                  data-time={type.t}
                  _hover={{ bg: `${"border.card"}70` }}
                  color={
                    type.is
                      ? lostWord === ""
                        ? theme.colors.semantic.word.completed
                        : theme.colors.semantic.word.correct
                      : theme.colors.error.main
                  }
                  wordBreak="break-all"
                >
                  {type.c.replace(/ /g, "ˍ")}
                </Text>
              </CustomToolTip>
            ),
        )}
        <Text as="span" wordBreak="break-all">
          {lostWord !== null ? lostWord : lineTypeWord}
        </Text>
      </Box>
    </>
  );
}

export default memo(ResultCardBody);
