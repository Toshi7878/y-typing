import React, { useEffect, useRef, useState } from "react";
import { Button, Card, CardBody, useTheme } from "@chakra-ui/react";
import { SearchResultRange } from "@/app/timeline/ts/type";
import SearchRange from "./child/SearchRange";
import {
  DEFAULT_CLEAR_RATE_SEARCH_RANGE,
  DEFAULT_KPM_SEARCH_RANGE,
} from "@/app/timeline/ts/const/consts";
import SearchModeRadio from "./child/SearchModeRadio";
import { ThemeColors } from "@/types";

const SearchCard = () => {
  const [isCardVisible, setIsCardVisible] = useState(false);
  const theme: ThemeColors = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsCardVisible(false);
      }
    };

    if (isCardVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCardVisible]);

  const [kpmRange, setKpmRange] = useState<SearchResultRange>({
    minValue: DEFAULT_KPM_SEARCH_RANGE.min,
    maxValue: DEFAULT_KPM_SEARCH_RANGE.max,
  });
  const [clearRateRange, setClearRateRange] = useState<SearchResultRange>({
    minValue: DEFAULT_CLEAR_RATE_SEARCH_RANGE.min,
    maxValue: DEFAULT_CLEAR_RATE_SEARCH_RANGE.max,
  });
  const [speedRange, setSpeedRange] = useState<SearchResultRange>({
    minValue: 1,
    maxValue: 2,
  });

  return (
    <>
      <Button onClick={() => setIsCardVisible(!isCardVisible)}>詳細フィルター</Button>

      {isCardVisible && (
        <Card
          ref={cardRef}
          position="absolute"
          zIndex={4}
          width={"500px"}
          mt={5}
          bg={theme.colors.card.bg}
          border="1px"
          borderColor={theme.colors.card.borderColor}
        >
          <CardBody>
            <SearchModeRadio />
            <SearchRange
              label={"kpm"}
              min={DEFAULT_KPM_SEARCH_RANGE.min}
              max={DEFAULT_KPM_SEARCH_RANGE.max}
              step={10}
              value={kpmRange}
              setValue={setKpmRange}
            />
            <SearchRange
              label={"% (クリア率)"}
              min={DEFAULT_CLEAR_RATE_SEARCH_RANGE.min}
              max={DEFAULT_CLEAR_RATE_SEARCH_RANGE.max}
              step={1}
              value={clearRateRange}
              setValue={setClearRateRange}
            />
            <SearchRange
              label={"倍速"}
              min={1}
              max={2}
              step={0.25}
              value={speedRange}
              setValue={setSpeedRange}
            />
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default SearchCard;
