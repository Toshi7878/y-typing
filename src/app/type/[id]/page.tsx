import Content from "./content";
import { Metadata } from "next";
import { getMapInfo } from "@/lib/server-fetcher/getMapInfo";
import TypeProvider from "./TypeProvider";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const mapInfo = await getMapInfo(params.id);

  return {
    title: `${mapInfo.title} - YTyping`,
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const mapInfo = await getMapInfo(params.id);
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <TypeProvider mapInfo={mapInfo}>
        <Content mapInfo={mapInfo} />
      </TypeProvider>
    </SessionProvider>
  );
}
