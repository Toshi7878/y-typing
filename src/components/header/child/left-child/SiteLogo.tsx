import { ThemeColors } from "@/types";
import { usePathname } from "next/navigation";
import { useLinkClick } from "@/app/nprogress";
import { Text, useTheme } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";

function SiteLogo() {
  const pathname = usePathname();
  const theme: ThemeColors = useTheme();
  const handleLinkClick = useLinkClick();
  return (
    <Link
      href={"/"}
      onClick={(event) =>
        pathname === "/" ? (window.location.href = "/") : handleLinkClick(event, `/`)
      }
      className="text-2xl relative top-[-2.5px]"
      color={theme.colors.color}
      _hover={{
        color: theme.colors.header.hover.color,
        bg: theme.colors.header.hover.bg,
      }}
    >
      <Text as="span" fontWeight="bold">
        Y
      </Text>
      <Text as="span" fontWeight="bold">
        Typing
      </Text>
    </Link>
  );
}

export default SiteLogo;
