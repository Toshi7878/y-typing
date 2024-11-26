"use server";
import "server-only";
import { cache } from "react";
import { UserTypingOptions } from "@/app/type/ts/type";
import { auth } from "../auth";

export const getUserTypingOptions = cache(async (): Promise<UserTypingOptions> => {
  const session = await auth();
  const userId = session?.user.id.toString() || "";
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/get-user-typing-options`); // URLを変数に格納
  const params: Record<string, string> = { userId };

  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
  }

  return response.json();
});
