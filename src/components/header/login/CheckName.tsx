"use client";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function CheckName({ name }: { name: string }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (name === "" && pathname !== "/user/register") {
      redirect("/user/register");
    }
  }, [name, pathname, router]);

  return null;
}
