"use server";
import { NewNotificationCheck } from "@/types/api";
import "server-only";
import { auth } from "../../server/auth";

export const getNewNotificationCheck = async (): Promise<boolean> => {
  const session = await auth();

  const userId = session?.user.id || "";

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/new-notification-check`);
  const params: Record<string, string> = { userId };

  url.search = new URLSearchParams(params).toString();
  const response = await fetch(url.toString(), {
    cache: "no-cache",
  });

  if (!response.ok) {
    console.error("Network response was not ok:", response.statusText);
    return false;
  }

  try {
    const json: NewNotificationCheck = await response.json();
    return json.checked === undefined ? false : true;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return false;
  }
};
