import { useTheme, Box, Flex } from "@chakra-ui/react";
import { ThemeColors, UploadResult } from "@/types";
import { BiEdit } from "react-icons/bi";
import { useLinkClick } from "@/lib/hooks/useLinkClick";
import { useParams } from "next/navigation";
import { Link } from "@chakra-ui/next-js";
import CustomToolTip from "@/components/CustomToolTip";
import { LikeButton } from "@/components/like-button/LikeButton";
import { toggleLikeServerAction } from "@/config/server-actions/toggle-like-server-action";
import { useFormState } from "react-dom";
import { INITIAL_STATE } from "@/config/consts";
import { useHasLocalLikeAtom, useSetHasLocalLikeAtom } from "@/app/type/type-atoms/gameRenderAtoms";
import { useSession } from "next-auth/react";
import { IoMdSettings } from "react-icons/io";

export default function TabIcons() {
  console.log("Tab");
  const theme: ThemeColors = useTheme();
  const { id: mapId } = useParams();
  const { data: session } = useSession();

  const handleLinkClick = useLinkClick();
  const hasLocalLikeAtom = useHasLocalLikeAtom();
  const setHasLocalLikeAtom = useSetHasLocalLikeAtom();
  const toggleClapAction = (state: UploadResult): Promise<UploadResult> => {
    // 楽観的UI更新
    const newHasLike = !hasLocalLikeAtom;
    setHasLocalLikeAtom(newHasLike);

    try {
      return toggleLikeServerAction(Number(mapId));
    } catch (error) {
      // エラーが発生した場合、元の状態に戻す
      setHasLocalLikeAtom(hasLocalLikeAtom);
      return Promise.reject(error); // エラーを返す
    }
  };

  const [state, formAction] = useFormState(toggleClapAction, INITIAL_STATE);
  return (
    <Box
      position="absolute"
      top="-20px"
      right="5px"
      color={`${theme.colors.color}99`}
      width="100px"
    >
      <Flex alignItems="center" justifyContent="flex-end">
        <CustomToolTip tooltipLabel="設定(未実装)" placement="top">
          <Box
            height="60px"
            display="flex"
            _hover={{ color: theme.colors.color }}
            alignItems="center"
            cursor="pointer"
          >
            <IoMdSettings size={36} />
          </Box>
        </CustomToolTip>
        {session?.user.id ? (
          <CustomToolTip tooltipLabel="譜面にいいね" placement="top">
            <Box as="form" action={formAction} _hover={{ color: theme.colors.color }}>
              <LikeButton size={62} defaultLiked={hasLocalLikeAtom} />
            </Box>
          </CustomToolTip>
        ) : null}

        <CustomToolTip tooltipLabel="譜面のEditページに移動" placement="top">
          <Box height="60px" display="flex" alignItems="center">
            <Link
              href={`/edit/${mapId}`}
              onClick={handleLinkClick}
              _hover={{ color: theme.colors.color }}
              cursor="pointer"
            >
              <BiEdit size={36} />
            </Link>
          </Box>
        </CustomToolTip>
      </Flex>
    </Box>
  );
}
