import { ThemeColors } from "@/types";
import { usePathname } from "next/navigation";
import { useLinkClick } from "@/lib/hooks/useLinkClick";
import { Text, useTheme } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";

function SiteLogo() {
  const pathname = usePathname();
  const theme: ThemeColors = useTheme();
  const handleLinkClick = useLinkClick();
  return (
    <Link
      href={"/"}
      onClick={pathname === "/" ? () => (window.location.href = "/") : handleLinkClick}
      className="text-2xl relative top-[-2.5px]"
      color={"text.body"}
      _hover={{
        color: theme.colors.text.header.hover,
        bg: `${theme.colors.secondary.main}30`,
      }}
      px={2}
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
