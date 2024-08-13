"use client";

import { NavItem, ThemeColors } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { handleLinkClick } from "@/app/nprogress";
import { Box, Text, useTheme } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";

interface LeftNavProps {
  items: NavItem[];
}

export default function LeftNav({ items }: LeftNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme: ThemeColors = useTheme();

  console.log(pathname);
  return (
    <Box className="flex md:gap-x-10">
      <Link
        href={"/"}
        onClick={
          pathname === "/" ? () => (window.location.href = "/") : handleLinkClick(`/`, router)
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
      <nav className="md:flex gap-6 hidden">
        {/* {items?.map((item, index) => {
          return (
            <Link
              key={index}
              href={item.href}
              className="text-lg sm:text-sm font-medium hover:text-foreground/80"
            >
              {item.title}
            </Link>
          );
        })} */}
      </nav>
    </Box>
  );
}
