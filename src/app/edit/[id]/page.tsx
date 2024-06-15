import React from "react";
import { RootState } from "../(redux)/store";
import InfoTabProvider from "../(contexts)/InfoTabProvider";
import { RefsProvider } from "../(contexts)/refsProvider";
import Content from "../content";

async function fetchMapData(id: string): Promise<FetchMapData> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/map?id=${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}

export interface FetchMapData {
  videoId: string;
  title: string;
  creatorComment: string;
  genre: string;
  tags: string[];
  mapData: RootState["mapData"]["value"];
}

export default async function Page({ params }: { params: { id: string } }) {
  const mapData = await fetchMapData(params.id);

  return (
    <InfoTabProvider>
      <RefsProvider>
        <Content data={mapData} />
      </RefsProvider>
    </InfoTabProvider>
  );
}
