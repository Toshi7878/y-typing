import Content from "./content";
import { Metadata } from "next";
import { getMapInfo } from "@/lib/server-fetcher/getMapInfo";
import TypeProvider from "./TypeProvider";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import { getUserTypingOptions } from "@/lib/server-fetcher/getUserTypingOptions";

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
  const userTypingOptions = session?.user.id
    ? await getUserTypingOptions(Number(session?.user.id))
    : undefined;

  return (
    <SessionProvider session={session}>
      <TypeProvider mapInfo={mapInfo} userTypingOptions={userTypingOptions}>
        <Content mapInfo={mapInfo} />
      </TypeProvider>
    </SessionProvider>
  );
}
