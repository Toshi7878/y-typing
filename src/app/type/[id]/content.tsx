"use client";
import React, { useLayoutEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store, { RootState } from "../../edit/(redux)/store";
import YouTubeContent from "../(youtube-content)/YoutubeConent";
import { setCreatorComment, setVideoId, setYtTitle } from "../../edit/(redux)/tabInfoInputSlice";
import { setGenre, setTags } from "../../edit/(redux)/GenreTagSlice";
import { setMapData } from "../../edit/(redux)/mapDataSlice";
import { useParams } from "next/navigation";

export interface FetchMapData {
  videoId: string;
  title?: string;
  creatorComment?: string;
  genre?: string;
  tags?: string[];
  mapData?: RootState["mapData"]["value"];
}

function Content({ data }: { data: FetchMapData }) {
  return (
    <Provider store={store}>
      <ContentInner data={data} />
    </Provider>
  );
}

function ContentInner({ data }: { data: FetchMapData }) {
  const { videoId, title, creatorComment, genre, tags } = data;
  const dispatch = useDispatch();
  const { id } = useParams();

  useLayoutEffect(() => {
    if (id) {
      dispatch(setVideoId(videoId));
      dispatch(setYtTitle(title));
      dispatch(setCreatorComment(creatorComment));
      dispatch(setGenre(genre));
      dispatch(setTags(tags));
      dispatch(setMapData(data.mapData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex min-h-screen sm:px-0 flex-col items-center pt-14 md:px-14">
      <section className="flex flex-col lg:flex-row w-full ">
        <YouTubeContent className="md:mr-5 md:min-w-[384px] md:min-h-[216px]" videoId={videoId} />
      </section>

      <section className="w-full mt-3">{/* <TableContent /> */}</section>
    </main>
  );
}

export default Content;
