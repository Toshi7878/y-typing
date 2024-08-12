"use client";

import { NavItem } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { handleLinkClick } from "@/app/nprogress";
import { Box, Text } from "@chakra-ui/react";
import Link from "next/link";

interface LeftNavProps {
  items: NavItem[];
}

export default function LeftNav({ items }: LeftNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  console.log(pathname);
  return (
    <Box className="flex items-center md:gap-10">
      <Text as="span" color={"color"}>
        <Link
          href={"/"}
          onClick={pathname === "/" ? undefined : handleLinkClick(`/`, router)}
          className="md:flex items-center space-x-2 font-extrabold text-xl"
        >
          Y-Typing
        </Link>
      </Text>
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
