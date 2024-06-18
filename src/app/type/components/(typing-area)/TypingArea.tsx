import { Box, Card, Heading } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../(redux)/store";
import { useEffect, useState } from "react";
import { timer } from "../(youtube-content)/timer";
import { setTimeIndex } from "../../(redux)/lineIndexSlice";

function TypingArea() {
  const [lineProgress, setLineProgress] = useState("0");
  const [maxLineProgress, setMaxLineProgress] = useState("0");
  const timeIndex = useSelector((state: RootState) => state.lineIndex?.timeIndex || 0);
  const mapData = useSelector((state: RootState) => state.mapData?.value || []);

  const dispatch = useDispatch();

  useEffect(() => {
    const updateLine = () => {
      if (timeIndex !== null) {
        if (
          mapData[timeIndex + 1] &&
          Number(timer.currentTime) >= Number(mapData[timeIndex + 1]["time"])
        ) {
          const maxProgress = (
            Number(mapData[timeIndex + 2]["time"]) - Number(mapData[timeIndex + 1]["time"])
          ).toFixed(3);
          setLineProgress("0");
          setMaxLineProgress(maxProgress);
          dispatch(setTimeIndex(timeIndex + 1));
        }
      } else {
        dispatch(setTimeIndex(0));
      }

      setLineProgress((Number(timer.currentTime) - Number(mapData[timeIndex]["time"])).toFixed(3));
    };

    timer.addListener(updateLine);
    return () => {
      timer.removeListener(updateLine);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeIndex, mapData]);

  return (
    <Box w="full" mt="8" h="calc(100vh - 400px)">
      <Card variant={"outline"} h="full" borderColor="black">
        <Box p="4" className="text-xl" display="inline">
          <progress className="w-full" value={lineProgress} max={maxLineProgress} />
        </Box>
        <Box p="4" className="text-xl" display="inline">
          <Heading
            as="h3"
            size="lg"
            className="indent-0"
            dangerouslySetInnerHTML={{
              __html: `${mapData[timeIndex]["lyrics"]}`,
            }}
          />
        </Box>
        <Box p="4" className="text-xl" display="inline">
          <Heading
            as="h3"
            size="lg"
            className="indent-0"
            dangerouslySetInnerHTML={{
              __html: `<ruby class="invisible">あ<rt>あ<rt></ruby>${mapData[timeIndex]["lyrics"]}`,
            }}
          />
        </Box>
      </Card>
    </Box>
  );
}

export default TypingArea;
