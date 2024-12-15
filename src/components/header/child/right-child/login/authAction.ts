"use server";

import { signIn, signOut } from "@/server/auth";

export async function handleSignIn(provider: "google" | "discord") {
  await signIn(provider);
}

export async function handleSignOut() {
  await signOut();
}
