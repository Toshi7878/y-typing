import { useTheme, Box } from "@chakra-ui/react";
import { ThemeColors } from "@/types";
import { BiEdit } from "react-icons/bi";
import { useLinkClick } from "@/lib/hooks/useLinkClick";
import { useParams } from "next/navigation";
import { Link } from "@chakra-ui/next-js";
import CustomToolTip from "@/components/CustomToolTip";
import { useSession } from "next-auth/react";

export default function TabIcons() {
  console.log("Tab");
  const theme: ThemeColors = useTheme();
  const { id } = useParams();
  const { data: session } = useSession();

  const handleLinkClick = useLinkClick();

  return (
    <Box position="absolute" top="-3px" right="0" color={`${theme.colors.color}99`}>
      <CustomToolTip tooltipLabel="譜面のEditページに移動します" placement="top">
        <Link
          href={`/edit/${id}`}
          onClick={handleLinkClick}
          _hover={{ color: theme.colors.color }}
          cursor="pointer"
        >
          <BiEdit size={32} />
        </Link>
      </CustomToolTip>
    </Box>
  );
}
