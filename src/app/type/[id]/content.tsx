"use client";
import React, { useLayoutEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store, { RootState } from "../../edit/(redux)/store";
import YouTubeContent from "../(youtube-content)/YoutubeConent";
import { setCreatorComment, setVideoId, setYtTitle } from "../../edit/(redux)/tabInfoInputSlice";
import { setGenre, setTags } from "../../edit/(redux)/GenreTagSlice";
import { setMapData } from "../../edit/(redux)/mapDataSlice";
import { useParams } from "next/navigation";
import TabContent from "../(tab)/Tab";
import { Box, Card, Flex } from "@chakra-ui/react";

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
    <main className="flex min-h-screen sm:px-0 flex-col items-center pt-8 md:px-14 w-full">
      <Flex direction="column" align="center" w="full" pt="8">
        <Flex w="full" gap="4" direction={{ base: "column", lg: "row" }}>
          <Box flex={{ base: "1", lg: "3" }}>
            <YouTubeContent className="" videoId={videoId} />
          </Box>

          <Box
            flex={{ base: "1", lg: "7" }}
            ml={{ lg: "auto" }}
            display="flex"
            flexDirection="column"
          >
            <TabContent />
          </Box>
        </Flex>

        <Box w="full" mt="8" h="calc(100vh - 400px)">
          <Card variant={"outline"} h="full" borderColor="black">
            <Box p="4">
              <h2>仮のタイトル</h2>
              <p>これは仮の内容です。後で実際のデータに置き換えてください。</p>
            </Box>
          </Card>
        </Box>
      </Flex>
    </main>
  );
}

export default Content;
