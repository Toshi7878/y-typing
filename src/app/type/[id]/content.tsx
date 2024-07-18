"use client";
import React, { CSSProperties, useEffect } from "react";
import YouTubeContent from "../components/(youtube-content)/YoutubeContent";
import { useParams } from "next/navigation";
import TabContent from "../components/(tab)/Tab";
import { Box, Flex } from "@chakra-ui/react";
import { GetInfoData } from "@/types/api";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CreateMap } from "../(ts)/createTypingWord";
import { useAtom } from "jotai";
import { mapAtom, mapIdAtom, sceneAtom } from "../(atoms)/gameRenderAtoms";
import SceneWrapper from "../components/(typing-area)/Scene";
import useWindowScale, { CONTENT_HEIGHT, CONTENT_WIDTH } from "./windowScale";
const queryClient = new QueryClient();

function Content({ mapInfo }: { mapInfo: GetInfoData }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ContentInner mapInfo={mapInfo} />
    </QueryClientProvider>
  );
}

function ContentInner({ mapInfo }: { mapInfo: GetInfoData }) {
  const { scale } = useWindowScale();

  const { videoId, title, creatorComment, tags } = mapInfo;
  const { id } = useParams();
  const [, setMap] = useAtom(mapAtom);
  const [, setScene] = useAtom(sceneAtom);
  const [, setMapId] = useAtom(mapIdAtom);

  //useQueryYouTubeコンポーネントで行う（あとでやる
  const { data, error, isLoading } = useQuery({
    queryKey: ["mapData", id],
    queryFn: async () => {
      setMapId(Number(id));

      if (!id) return;
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/map?id=${id}`);
      const map = new CreateMap(data.mapData);
      setMap(map);
      return map;
    },

    enabled: !!id, // useQueryをidが存在する場合にのみ実行
    staleTime: Infinity, // データを常に新鮮に保つ
    refetchOnWindowFocus: false, // ウィンドウフォーカス時に再フェッチしない
    refetchOnReconnect: false, // 再接続時に再フェッチしない
    refetchOnMount: false, // マウント時に再フェッチしない
  });
  useEffect(() => {
    return () => {
      // コンポーネントのアンマウント時にクエリキャッシュをクリア
      queryClient.removeQueries({ queryKey: ["mapData", id] });
      setMap(null); // 追加: アンマウント時にsetMap(null)を呼び出す
      setScene("ready");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, queryClient]);

  const style: CSSProperties = {
    transform: `scale(${scale})`,
    transformOrigin: "top",
    width: `${CONTENT_WIDTH}px`,
    height: `${CONTENT_HEIGHT}px`,
  };

  return (
    <main
      className="flex flex-col items-center pt-16"
      style={{
        height: "100vh",
      }}
    >
      <Box style={style}>
        <Flex direction="column">
          <Flex gap="4">
            <Box className="">
              <YouTubeContent
                className={` w-[600px] ${isLoading ? "invisible" : ""} aspect-video`}
                videoId={videoId}
              />
            </Box>
            <Box flex={{ base: "8" }} flexDirection="column">
              <TabContent />
            </Box>
          </Flex>
          <Box className=" mt-6">
            <SceneWrapper />
          </Box>
        </Flex>
      </Box>
    </main>
  );
}

export default Content;
