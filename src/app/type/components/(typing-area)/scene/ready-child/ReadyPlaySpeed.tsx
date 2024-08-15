import { speedAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { useRefs } from "@/app/type/(contexts)/refsProvider";
import { YTSpeedController } from "@/app/type/(ts)/ytHandleEvents";
import { Box, Button, HStack, Tooltip } from "@chakra-ui/react";
import { useAtom } from "jotai";
import React from "react";

interface ReadyPlaySpeedProps {
  speedUpButtonRef: React.RefObject<HTMLButtonElement>;
  speedDownButtonRef: React.RefObject<HTMLButtonElement>;
}
const ReadyPlaySpeed = (props: ReadyPlaySpeedProps) => {
  const [speedData, setSpeedData] = useAtom(speedAtom);
  const { playerRef } = useRefs();

  return (
    <Tooltip
      label="低速プレイではランキング登録できません"
      placement="right"
      isOpen={speedData.defaultSpeed < 1 && true}
      color="white" // テキスト色を白に変更
      p={4} // パディングを追加
      borderRadius="md" // 角を丸く
      boxShadow="lg" // シャドウを追加
    >
      <HStack
        borderColor={"type.card.borderColor"}
        style={{ border: "1px solid" }}
        px={8}
        py={6}
        className="rounded-lg"
        boxShadow="md"
      >
        <Box>
          <Button
            variant="link"
            colorScheme="cyan"
            ref={props.speedDownButtonRef}
            style={{ textDecoration: "none" }} // 下線非表示
            onClick={() => {
              new YTSpeedController("down", {
                speedData,
                setSpeedData,
                playerRef: playerRef!.current,
              });
            }}
          >
            <Box className="relative text-3xl" style={{ top: "4px" }}>
              -<small className="f-key">F9</small>
            </Box>
          </Button>
        </Box>

        <Box className="font-bold mx-8 text-4xl">
          <span id="speed">{speedData.defaultSpeed.toFixed(2)}</span>倍速
        </Box>

        <Box>
          <Button
            variant="link"
            colorScheme="cyan"
            ref={props.speedUpButtonRef}
            style={{ textDecoration: "none" }} // 下線非表示
            onClick={() => {
              new YTSpeedController("up", {
                speedData,
                setSpeedData,
                playerRef: playerRef!.current,
              });
            }}
          >
            <Box className="relative text-3xl" style={{ top: "4px" }}>
              +<small className="f-key">F10</small>
            </Box>
          </Button>
        </Box>
      </HStack>
    </Tooltip>
  );
};

export default ReadyPlaySpeed;
