import { INITIAL_STATE } from "@/config/consts";
import { toggleClapServerAction } from "@/config/server-actions/toggle-clap-server-action";
import { LocalClapState, ThemeColors, UploadResult } from "@/types";
import { Box, Button, useTheme } from "@chakra-ui/react";
import { Dispatch } from "react";
import { useFormState } from "react-dom";

interface MenuClapButtonProps {
  resultId: number;
  setClapLocalState: Dispatch<LocalClapState>;
  optimisticState: LocalClapState;
  setOptimisticState: Dispatch<LocalClapState>;
}

const MenuClapButton = ({
  resultId,
  setClapLocalState,
  optimisticState,
  setOptimisticState,
}: MenuClapButtonProps) => {
  const theme: ThemeColors = useTheme();

  const toggleClapAction = async (state: UploadResult): Promise<UploadResult> => {
    // 楽観的UI更新
    const newOptimisticState = {
      hasClap: !optimisticState.hasClap,
      clapCount: optimisticState.hasClap
        ? optimisticState.clapCount - 1
        : optimisticState.clapCount + 1,
    };

    setOptimisticState(newOptimisticState);

    try {
      const result = await toggleClapServerAction(resultId);
      if (result.id) {
        setClapLocalState(newOptimisticState);
      }

      return result;
    } catch (error) {
      // エラーが発生した場合、元の状態に戻す

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
        _hover={{ backgroundColor: `${theme.colors.text.body}60` }}
      >
        {optimisticState.hasClap ? "拍手済み" : "記録に拍手"}
      </Button>
    </Box>
  );
};

export default MenuClapButton;
