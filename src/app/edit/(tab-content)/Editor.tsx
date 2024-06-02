import React, { useEffect, useState } from "react";

import { Input, Box, Button, Textarea } from "@chakra-ui/react";
import { timer } from "../(youtube-content)/timer";

const Editor = () => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const updateRangeValue = () => setTime(timer.currentTime);
    timer.addListener(updateRangeValue);

    return () => {
      timer.removeListener(updateRangeValue);
    };
  }, []);
  return (
    <div>
      <div>
        <Box display="flex" alignItems="center">
          <Input placeholder="Time" size="sm" width="90px" value={time} />
          <Input placeholder="歌詞" size="sm" />
        </Box>
      </div>
      <div>
        <Box display="flex" alignItems="center">
          <Input placeholder="No." size="sm" width="90px" disabled />
          <Input placeholder="ワード" size="sm" />
        </Box>
      </div>
      <div>
        <Box display="flex" alignItems="center">
          <Button
            size="sm"
            width="100px"
            height="40px"
            colorScheme="teal"
            _hover={{ bg: "#6ee278ac" }}
            variant="outline"
          >
            追加
          </Button>
        </Box>
      </div>
      <div>
        <Box display="flex" alignItems="center">
          <Textarea placeholder="ここから歌詞をまとめて追加できます" />
        </Box>
      </div>
    </div>
  );
};

export default Editor;
