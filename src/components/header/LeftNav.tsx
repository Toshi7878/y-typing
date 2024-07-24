"use client";

import { NavItem } from "@/types";
import { Link } from "@chakra-ui/next-js";
import { useEffect } from "react";
import NProgress from "nprogress";
import { useRouter } from "next/navigation";
import { handleLinkClick } from "@/app/nprogress";

interface LeftNavProps {
  items: NavItem[];
}

export default function LeftNav({ items }: LeftNavProps) {
  const router = useRouter();

  return (
    <div className="flex items-center md:gap-10">
      <span>
        <Link
          href={"/"}
          // onClick={handleLinkClick(`/`, router)}
          className="md:flex items-center space-x-2 font-extrabold text-xl"
        >
          Y-Typing
        </Link>
      </span>
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
    </div>
  );
}
