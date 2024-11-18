"use server";
import { GetInfoData } from "@/types/api";
import "server-only";
import { cache } from "react";
import { UserTypingOptions } from "@/app/type/ts/type";

export const getUserTypingOptions = cache(
  async (sessionId: number | null): Promise<UserTypingOptions> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/get-user-typing-options?sessionid=${sessionId}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },
);
