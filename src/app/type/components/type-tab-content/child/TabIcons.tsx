import { useTheme, Box, Flex } from "@chakra-ui/react";
import { ThemeColors } from "@/types";
import { BiEdit } from "react-icons/bi";
import { useLinkClick } from "@/lib/hooks/useLinkClick";
import { useParams } from "next/navigation";
import { Link } from "@chakra-ui/next-js";
import CustomToolTip from "@/components/CustomToolTip";
import { useSession } from "next-auth/react";
import { LikeButton } from "@/components/like-button/LikeButton";

export default function TabIcons() {
  console.log("Tab");
  const theme: ThemeColors = useTheme();
  const { id } = useParams();
  const { data: session } = useSession();

  const handleLinkClick = useLinkClick();

  return (
    <Box
      position="absolute"
      top="-19px"
      right="5px"
      color={`${theme.colors.color}99`}
      width="100px"
    >
      <Flex alignItems="center" justifyContent="space-between">
        <CustomToolTip tooltipLabel="譜面にいいねします(未実装)" placement="top">
          <Box _hover={{ color: theme.colors.color }}>
            <LikeButton size={62} />
          </Box>
        </CustomToolTip>

        <CustomToolTip tooltipLabel="譜面のEditページに移動します" placement="top">
          <Box height="60px" display="flex" alignItems="center">
            <Link
              href={`/edit/${id}`}
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
