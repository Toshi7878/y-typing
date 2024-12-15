import { serverApi } from "@/trpc/server";
import { Metadata } from "next";
import Content from "../components/Content";
import EditProvider from "../components/EditProvider";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const mapInfo = await serverApi.map.getMapInfo({ mapId: Number(params.id) });

  // const mapInfo = await getMapInfo(params.id);

  return {
    title: `Edit ${mapInfo!.title} - YTyping`,
  };
}
export default async function Page({ params }: { params: { id: string } }) {
  const mapInfo = await serverApi.map.getMapInfo({ mapId: Number(params.id) });
  // const mapInfo = await getMapInfo(params.id);

  return (
    <EditProvider mapInfo={mapInfo}>
      <Content />
    </EditProvider>
  );
}
