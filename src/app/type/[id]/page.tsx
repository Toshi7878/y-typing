import Content from "./content";
import { Metadata } from "next";
import { getMapInfo } from "@/lib/server-fetcher/getMapInfo";
import TypeProvider from "./TypeProvider";
import { auth } from "@/lib/auth";
import { getUserTypingOptions } from "@/lib/server-fetcher/getUserTypingOptions";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const mapInfo = await getMapInfo(params.id);

  return {
    title: `${mapInfo.title} - YTyping`,
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  const mapInfo = await getMapInfo(params.id);
  const userTypingOptions = session?.user.id ? await getUserTypingOptions() : undefined;

  return (
    <TypeProvider mapInfo={mapInfo} userTypingOptions={userTypingOptions}>
      <Content mapInfo={mapInfo} />
    </TypeProvider>
  );
}
