import { INITIAL_STATE } from "@/config/consts";
import { toggleClapServerAction } from "@/config/server-actions/toggle-clap-server-action";
import { UploadResult } from "@/types";
import { Box, Button, useTheme } from "@chakra-ui/react";
import { Dispatch } from "react";
import { useFormState } from "react-dom";

interface MenuClapButtonProps {
  resultId: number;
  localClapCount: number;
  localHasClap: boolean;
  setLocalHasClap: Dispatch<boolean>;
  setLocalClapCount: Dispatch<number>;
}

const MenuClapButton = ({
  resultId,
  localClapCount,
  localHasClap,
  setLocalHasClap,
  setLocalClapCount,
}: MenuClapButtonProps) => {
  const theme = useTheme();

  const toggleClapAction = (state: UploadResult): Promise<UploadResult> => {
    // 楽観的UI更新
    const newHasClap = !localHasClap;
    const newClapCount = newHasClap ? localClapCount + 1 : localClapCount - 1;
    setLocalHasClap(newHasClap);
    setLocalClapCount(newClapCount);

    try {
      return toggleClapServerAction(resultId);
    } catch (error) {
      // エラーが発生した場合、元の状態に戻す
      setLocalHasClap(localHasClap);
      setLocalClapCount(localClapCount);
      return Promise.reject(error); // エラーを返す
    }
  };

  const [state, formAction] = useFormState(toggleClapAction, INITIAL_STATE);
  return (
    <Box as="form" action={formAction}>
      {" "}
      <Button
        width="100%"
        variant="unstyled"
        size="md"
        type="submit"
        _hover={{ backgroundColor: theme.colors.popup.hover.bg }}
      >
        {localHasClap ? "拍手済み" : "記録に拍手"}
      </Button>
    </Box>
  );
};

export default MenuClapButton;
