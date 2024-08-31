import { ThemeColors } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { handleLinkClick } from "@/app/nprogress";
import { Text, useTheme } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";

function SiteLogo() {
  const router = useRouter();
  const pathname = usePathname();
  const theme: ThemeColors = useTheme();
  return (
    <Link
      href={"/"}
      onClick={pathname === "/" ? () => (window.location.href = "/") : handleLinkClick(`/`, router)}
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
