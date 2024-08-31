import Content from "./content";
import { Metadata } from "next";
import { getMapInfo } from "@/lib/server-fetcher/getMapInfo";
import TypeProvider from "./TypeProvider";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const mapInfo = await getMapInfo(params.id);

  return {
    title: `${mapInfo.title} - YTyping`,
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const mapInfo = await getMapInfo(params.id);

  return (
    <TypeProvider>
      <Content mapInfo={mapInfo} />
    </TypeProvider>
  );
}
