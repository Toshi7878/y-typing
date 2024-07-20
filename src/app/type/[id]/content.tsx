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
import { mapAtom, mapIdAtom, rankingScoresAtom, sceneAtom } from "../(atoms)/gameRenderAtoms";
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
  const [, setRankingScores] = useAtom(rankingScoresAtom);

  //useQueryYouTubeコンポーネントで行う（あとでやる
  const { data, error, isLoading } = useQuery({
    queryKey: ["mapData", id],
    queryFn: async () => {
      setMapId(Number(id));

      if (id === "9") {
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
      setRankingScores([]);
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

const testMap = [
  {
    time: "0",
    word: "",
    lyrics: "",
  },
  {
    time: "31.135",
    word: "まよって",
    lyrics: "迷って",
  },
  {
    time: "33.739",
    word: "まよって",
    lyrics: "迷って",
  },
  {
    time: "35.721",
    word: "らびりんす",
    lyrics: "ラビリンス",
  },
  {
    time: "39.666",
    word: "どきどき",
    lyrics: "ドキドキ",
  },
  {
    time: "41.527",
    word: "こまって",
    lyrics: "困って",
  },
  {
    time: "44.231",
    word: "こまって",
    lyrics: "困って",
  },
  {
    time: "46.225",
    word: "こまーしゃる",
    lyrics: "コマーシャル",
  },
  {
    time: "50.138",
    word: "そういえば",
    lyrics: "そういえば",
  },
  {
    time: "53.461",
    word: "なつのおわりは",
    lyrics: "夏の終わりは",
  },
  {
    time: "56.297",
    word: "あまいきゃんでぃーだった",
    lyrics: "甘いキャンディーだった",
  },
  {
    time: "60.744",
    word: "",
    lyrics: " ",
  },
  {
    time: "63.887",
    word: "なつのおわりに",
    lyrics: "夏の終わりに",
  },
  {
    time: "66.755",
    word: "わたしこいをした",
    lyrics: "わたし恋をした",
  },
  {
    time: "71.597",
    word: "",
    lyrics: " ",
  },
  {
    time: "73.337",
    word: "きかせて",
    lyrics: "聞かせて",
  },
  {
    time: "75.908",
    word: "きかせて",
    lyrics: "聞かせて",
  },
  {
    time: "77.949",
    word: "えぴそーど",
    lyrics: "エピソード",
  },
  {
    time: "81.731",
    word: "わくわく",
    lyrics: "ワクワク",
  },
  {
    time: "83.922",
    word: "はじけて",
    lyrics: "はじけて",
  },
  {
    time: "86.420",
    word: "はじけて",
    lyrics: "はじけて",
  },
  {
    time: "88.359",
    word: "はちがつの",
    lyrics: "八月の",
  },
  {
    time: "92.236",
    word: "すとーりー",
    lyrics: "ストーリー",
  },
  {
    time: "95.680",
    word: "なつのおわりの",
    lyrics: "夏の終わりの",
  },
  {
    time: "98.541",
    word: "りんすしゃんぷーせっけん",
    lyrics: "リンスシャンプー石鹸",
  },
  {
    time: "102.830",
    word: "",
    lyrics: "",
  },
  {
    time: "106.137",
    word: "なつのおわりに",
    lyrics: "夏の終わりに",
  },
  {
    time: "109.068",
    word: "あわいこいをした",
    lyrics: "淡い恋をした",
  },
  {
    time: "113.317",
    word: "",
    lyrics: "",
  },
  {
    time: "115.961",
    word: "こんとれっくすはこがい",
    lyrics: "コントレックス箱買い",
  },
  {
    time: "118.502",
    word: "こんとれっくすはこはこはこがい",
    lyrics: "コントレックスはこはこはこ買い",
  },
  {
    time: "121.293",
    word: "こんとれっくすはこがい",
    lyrics: "コントレックス箱買い",
  },
  {
    time: "123.731",
    word: "こんとれっくす",
    lyrics: "コントレックス",
  },
  {
    time: "126.480",
    word: "こんとれっくすはこがい",
    lyrics: "コントレックス箱買い",
  },
  {
    time: "129.133",
    word: "こんとれっくすはこはこはこがい",
    lyrics: "コントレックスはこはこはこ買い",
  },
  {
    time: "131.771",
    word: "こんとれっくすはこがい",
    lyrics: "コントレックス箱買い",
  },
  {
    time: "134.320",
    word: "こんとれっくす",
    lyrics: "コントレックス",
  },
  {
    time: "136.849",
    word: "",
    lyrics: "",
  },
  {
    time: "157.133",
    word: "まよってまよって",
    lyrics: "迷って迷って",
  },
  {
    time: "159.871",
    word: "まよってまよって",
    lyrics: "迷って迷って",
  },
  {
    time: "162.395",
    word: "まよってまよって",
    lyrics: "迷って迷って",
  },
  {
    time: "165.144",
    word: "まよってまよって",
    lyrics: "迷って迷って",
  },
  {
    time: "167.604",
    word: "こまってこまって",
    lyrics: "困って困って",
  },
  {
    time: "170.249",
    word: "こまってこまって",
    lyrics: "困って困って",
  },
  {
    time: "172.830",
    word: "こまってこまって",
    lyrics: "困って困って",
  },
  {
    time: "175.826",
    word: "こまってこまって",
    lyrics: "困って困って",
  },
  {
    time: "178.163",
    word: "ふたりはふたりは",
    lyrics: "二人は二人は",
  },
  {
    time: "181.013",
    word: "であってであって",
    lyrics: "出会って出会って",
  },
  {
    time: "183.469",
    word: "であってであって",
    lyrics: "出会って出会って",
  },
  {
    time: "186.113",
    word: "であってであって",
    lyrics: "出会って出会って",
  },
  {
    time: "188.550",
    word: "まよってまよって",
    lyrics: "迷って迷って",
  },
  {
    time: "191.338",
    word: "まよってまよって",
    lyrics: "迷って迷って",
  },
  {
    time: "193.826",
    word: "まよってまよって",
    lyrics: "迷って迷って",
  },
  {
    time: "196.468",
    word: "まよって",
    lyrics: "迷って",
  },
  {
    time: "200.492",
    word: "なつのおわりは",
    lyrics: "夏の終わりは",
  },
  {
    time: "203.846",
    word: "あまいきゃんでぃーだった",
    lyrics: "甘いキャンディーだった",
  },
  {
    time: "220.541",
    word: "",
    lyrics: "end",
  },
];

export default Content;
