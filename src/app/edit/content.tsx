"use client";
import React, { useLayoutEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "./(redux)/store";
import TabContent from "./(tab-content)/Tab";
import TableContent from "./(table-content)/TableContent";
import TimeRange from "./TimeRange";
import YouTubeContent from "./(youtube-content)/YoutubeConent";
import { FetchMapData } from "./[id]/page";
import { setCreatorComment, setVideoId, setYtTitle } from "./(redux)/tabInfoInputSlice";
import { setGenre, setTags } from "./(redux)/GenreTagSlice";
import { setMapData } from "./(redux)/mapDataSlice";

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

  useLayoutEffect(() => {
    dispatch(setVideoId(videoId));
    dispatch(setYtTitle(title));
    dispatch(setCreatorComment(creatorComment));
    dispatch(setGenre(genre));
    dispatch(setTags(tags));
    dispatch(setMapData(data.mapData));
  }, [creatorComment, data.mapData, dispatch, genre, tags, title, videoId]);

  return (
    <main className="flex min-h-screen sm:px-0 flex-col items-center pt-14 md:px-14">
      <section className="flex flex-col lg:flex-row w-full ">
        <YouTubeContent className="md:mr-5 md:min-w-[384px] md:min-h-[216px]" videoId={videoId} />
        <TabContent className="w-full border-black" />
      </section>
      <section className="w-full mt-2">
        <TimeRange />
      </section>
      <section className="w-full mt-3">
        <TableContent />
      </section>
    </main>
  );
}

export default Content;
