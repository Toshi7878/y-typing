import Content from "./content";
import { Metadata } from "next";
import { getMapInfo } from "@/lib/server-fetcher/getMapInfo";
import TypeProvider from "./TypeProvider";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const session = await auth();

  const mapInfo = await getMapInfo(params.id, Number(session?.user.id));

  return {
    title: `${mapInfo.title} - YTyping`,
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  const mapInfo = await getMapInfo(params.id, Number(session?.user.id));

  return (
    <SessionProvider session={session}>
      <TypeProvider mapInfo={mapInfo}>
        <Content mapInfo={mapInfo} />
      </TypeProvider>
    </SessionProvider>
  );
}
