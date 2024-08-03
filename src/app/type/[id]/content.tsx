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
import {
  inputModeAtom,
  lineSelectIndexAtom,
  mapAtom,
  mapIdAtom,
  playingNotifyAtom,
  rankingScoresAtom,
  sceneAtom,
  speedAtom,
} from "../(atoms)/gameRenderAtoms";
import SceneWrapper from "../components/(typing-area)/Scene";
import useWindowScale, { CONTENT_HEIGHT, CONTENT_WIDTH } from "./windowScale";
import NProgress from "nprogress";
import { InputModeType } from "../(ts)/type";

export const queryClient = new QueryClient();

function Content({ mapInfo }: { mapInfo: GetInfoData }) {
  useEffect(() => {
    NProgress.done();
  }, []);
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
  const [, setRankingScores] = useAtom(rankingScoresAtom);
  const [, setSpeedData] = useAtom(speedAtom);
  const [, setInputMode] = useAtom(inputModeAtom);
  const [, setLineSelectIndex] = useAtom(lineSelectIndexAtom);
  const [, setNotify] = useAtom(playingNotifyAtom);

  //useQueryYouTubeコンポーネントで行う（あとでやる
  const { data, error, isLoading } = useQuery({
    queryKey: ["mapData", id],
    queryFn: async () => {
      setMapId(Number(id));

      if (id === "1") {
        setMap(new CreateMap(testMap));
        return;
      }

      if (!id) return;
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/map?id=${id}`);
      setMap(new CreateMap(data.mapData));
      return;
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
      setNotify(Symbol(""));
      setLineSelectIndex(1);
      const inputMode = (localStorage.getItem("inputMode") as InputModeType) || "roma";

      setInputMode(inputMode);
      setRankingScores([]);
      setSpeedData({
        defaultSpeed: 1,
        playSpeed: 1,
      });
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
          <Flex gap="6">
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
          <Box className=" mt-5">
            <SceneWrapper />
          </Box>
        </Flex>
      </Box>
    </main>
  );
}

const testMap = [
  {
    time: "0",
    word: "",
    lyrics: "",
  },
  {
    time: "13.325",
    word: "きみがよは",
    lyrics: "君が代は",
  },
  {
    time: "23.508",
    word: "ちよにやちよに",
    lyrics: "千代に八千代に",
  },
  {
    time: "34.313",
    word: "さざれいしの",
    lyrics: "さざれ石の",
  },
  {
    time: "45.164",
    word: "いわおとなりて",
    lyrics: "巌となりて",
  },
  {
    time: "55.831",
    word: "こけのむすまで",
    lyrics: "苔のむすまで",
  },
  {
    time: "82.461",
    word: "",
    lyrics: "end",
  },
];

export default Content;
