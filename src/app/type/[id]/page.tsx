import Content from "./content";
import { Metadata } from "next";
import TypeProvider from "./TypeProvider";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import { GetInfoData } from "@/types/api";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/map-info?id=${params.id}`);
  const mapInfo: GetInfoData = await response.json(); // 修正箇所
  return {
    title: `${mapInfo.title} - YTyping`,
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/map-info?id=${params.id}`);
  const mapInfo: GetInfoData = await response.json(); // 修正箇所

  const session = await auth();

  return (
    <SessionProvider session={session}>
      <TypeProvider>
        <Content mapInfo={mapInfo} />
      </TypeProvider>
    </SessionProvider>
  );
}
