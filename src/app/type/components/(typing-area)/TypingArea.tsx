import { Box, Card, Heading } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../(redux)/store";
import { useEffect, useState } from "react";
import { timer } from "../(youtube-content)/timer";
import { setTimeCount } from "../../(redux)/lineCountSlice";

function TypingArea() {
  const [lineProgress, setLineProgress] = useState("0");
  const timeIndex = useSelector((state: RootState) => state.lineCountReducer.timeCount);
  const mapData = useSelector((state: RootState) => state.mapData?.value || []);

  const [maxLineProgress, setMaxLineProgress] = useState("0");
  const dispatch = useDispatch();

  useEffect(() => {
    const updateLine = () => {
      if (Number(timer.currentTime) >= Number(mapData[timeIndex]["time"])) {
        const maxProgress = (
          Number(mapData[timeIndex + 1]["time"]) - Number(mapData[timeIndex]["time"])
        ).toFixed(3);
        setLineProgress("0");
        setMaxLineProgress(maxProgress);
        dispatch(setTimeCount(timeIndex + 1));
      }

      if (timeIndex) {
        setLineProgress(
          (Number(timer.currentTime) - Number(mapData[timeIndex - 1]["time"])).toFixed(3),
        );
      } else {
        setLineProgress(Number(timer.currentTime).toFixed(3));
      }
    };

    timer.addListener(updateLine);
    return () => {
      timer.removeListener(updateLine);
    };
  }, [timeIndex, mapData, dispatch]);
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
              __html: `${timeIndex ? mapData[timeIndex - 1]["lyrics"] : ""}`,
            }}
          />
        </Box>
        <Box p="4" className="text-xl" display="inline">
          <Heading
            as="h3"
            size="lg"
            className="indent-0"
            dangerouslySetInnerHTML={{
              __html: `<ruby class="invisible">あ<rt>あ<rt></ruby>${timeIndex ? mapData[timeIndex - 1]["lyrics"] : ""}`,
            }}
          />
        </Box>
      </Card>
    </Box>
  );
}

export default TypingArea;
