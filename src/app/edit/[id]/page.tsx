import React from "react";
import Content from "../components/Content";
import EditProvider from "../components/EditProvider";
import { getMapInfo } from "@/lib/server-fetcher/getMapInfo";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const mapInfo = await getMapInfo(params.id);
  return {
    title: `Edit ${mapInfo.title} - YTyping`,
  };
}
export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();

  const mapInfo = await getMapInfo(params.id);

  return (
    <SessionProvider session={session}>
      <EditProvider mapInfo={mapInfo}>
        <Content />
      </EditProvider>
    </SessionProvider>
  );
}
