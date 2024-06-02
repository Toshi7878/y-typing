"use client";

import { NavItem } from "@/types";
import { Link } from "@chakra-ui/next-js";

interface MainNavProps {
  items: NavItem[];
}

export default function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex items-center md:gap-10">
      <span>
        <Link
          href={"/"}
          className="md:flex items-center space-x-2 font-extrabold text-2xl"
        >
          Y-Typing
        </Link>
      </span>
      <nav className="md:flex gap-6 hidden">
        {items?.map((item, index) => {
          return (
            <Link
              key={index}
              href={item.href}
              className="text-lg sm:text-sm font-medium hover:text-foreground/80"
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
