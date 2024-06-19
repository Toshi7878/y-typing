"use client";
import React, { useLayoutEffect } from "react";
import YouTubeContent from "../components/(youtube-content)/YoutubeContent";
import { useParams } from "next/navigation";
import TabContent from "../components/(tab)/Tab";
import { Box, Flex } from "@chakra-ui/react";
import { GetInfoData } from "@/types/api";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import axios from "axios";
import TypingArea from "../components/(typing-area)/TypingArea";
import { CreateMap } from "../(ts)/createTypingWord";
import { atom } from "jotai";
import { Line } from "@/types";
const queryClient = new QueryClient();

function Content({ mapInfo }: { mapInfo: GetInfoData }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ContentInner mapInfo={mapInfo} />
    </QueryClientProvider>
  );
}

function ContentInner({ mapInfo }: { mapInfo: GetInfoData }) {
  const { videoId, title, creatorComment, tags } = mapInfo;
  const { id } = useParams();

  const { data, error, isLoading } = useQuery({
    queryKey: ["mapData"],
    queryFn: async () => {
      if (!id || id == "2") return;
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/map?id=${id}`);
      const map = new CreateMap(data.mapData);
      const mapAtom = atom(map);
      return data.mapData as Line[];
    },

    enabled: !!id, // useQueryをidが存在する場合にのみ実行
    staleTime: Infinity, // データを常に新鮮に保つ
  });

  useLayoutEffect(() => {
    if (id) {
      if (id == "2") {
        const map = new CreateMap(mapData);
        const mapAtom = atom(map);

        console.log(map);
      }
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
        {!isLoading && data && <TypingArea mapData={data} />}
      </Flex>
    </main>
  );
}

const mapData = [
  { time: "0", word: "", lyrics: "" },
  { time: "0.035", word: "やさしく", lyrics: "やさしく" },
  { time: "3.509", word: "されたい", lyrics: "されたい" },
  {
    time: "5.825",
    word: "ときどきしんぞうはちょっとひらいて",
    lyrics: "ときどき心臓は ちょっと開いて",
  },
  { time: "10.110", word: "あたらしくあいじょうを", lyrics: "新しく愛情を" },
  { time: "13.553", word: "", lyrics: "" },
  { time: "14.575", word: "からまったように", lyrics: "絡まったように" },
  { time: "16.407", word: "あぶない", lyrics: "危ない" },
  { time: "18.756", word: "むきだしっぱとげのように", lyrics: "むきだしっぱトゲのように" },
  { time: "21.673", word: "とんがって", lyrics: "とんがって" },
  { time: "23.029", word: "かたくななひょうじょうで", lyrics: "かたくなな表情で" },
  { time: "26.490", word: "", lyrics: "" },
  {
    time: "27.502",
    word: "あすをゆめみることなく",
    lyrics: "<ruby>明日<rt>あす</rt></ruby>を夢見ることなく",
  },
  { time: "31.906", word: "いかりだけが", lyrics: "怒りだけが" },
  { time: "33.671", word: "こころとかして", lyrics: "心溶かして" },
  { time: "36.831", word: "", lyrics: "" },
  { time: "37.933", word: "なにものにもなれないや", lyrics: "何者にもなれないや" },
  {
    time: "41.452",
    word: "みつめあうままでせかいはふたりだけ",
    lyrics: "見つめ合うままで 世界は2人だけ",
  },
  { time: "46.527", word: "かまわないでくれ", lyrics: "かまわないでくれ" },
  { time: "48.442", word: "そんなきれいごとわかってる", lyrics: "そんな綺麗事 分かってる" },
  { time: "51.979", word: "すばらしきかな", lyrics: "素晴らしきかな" },
  {
    time: "53.697",
    word: "ほんとうもうそもごちゃまぜにしてよ",
    lyrics: "本当も嘘もごちゃ混ぜにしてよ",
  },
  { time: "57.402", word: "", lyrics: "" },
  { time: "69.745", word: "うかれてみても", lyrics: "浮かれてみても" },
  { time: "74.461", word: "あさもよるもなんか", lyrics: "朝も夜もなんか" },
  {
    time: "79.509",
    word: "ちがぎらっとなみうってよこしまなかんじょうも",
    lyrics: "血がギラっと 波打って よこしまな感情も",
  },
  { time: "85.857", word: "", lyrics: "" },
  { time: "87.552", word: "こわれてしまうよ", lyrics: "壊れてしまうよ" },
  { time: "93.337", word: "", lyrics: "" },
  { time: "99.575", word: "ただ", lyrics: "ただ" },
  { time: "100.777", word: "あなたのままで", lyrics: "あなたのままで" },
  { time: "102.653", word: "ほんとうならそれだけで", lyrics: "本当ならそれだけで" },
  { time: "105.852", word: "すてきなはずで", lyrics: "素敵なはずで" },
  { time: "107.843", word: "きっときれいごとわかってる", lyrics: "きっと綺麗事 分かってる" },
  {
    time: "111.334",
    word: "かなしきかなみそもくそもごちゃまぜにしろよ",
    lyrics: "哀しきかな みそもくそもごちゃ混ぜにしろよ",
  },
  { time: "116.685", word: "", lyrics: "" },
  { time: "118.578", word: "みかんせいな", lyrics: "未完成な" },
  { time: "121.366", word: "こんなわたしをほめて", lyrics: "こんな私を褒めて" },
  {
    time: "123.983",
    word: "ほめてほめてほめてほめてほめてほめてほめてほめてほめてほめてほめてほめてほめてほめて",
    lyrics:
      "褒めて 褒めて 褒めて 褒めて 褒めて 褒めて 褒めて 褒めて 褒めて 褒めて 褒めて 褒めて 褒めて 褒めて",
  },
  { time: "133.043", word: "", lyrics: "" },
  { time: "155.006", word: "さらばさ", lyrics: "さらばさ" },
  { time: "157.067", word: "かぜもなみもなにもかにも", lyrics: "風も 浪も 何もかにも" },
  { time: "164.697", word: "だれもかれも", lyrics: "誰も彼も" },
  { time: "170.897", word: "", lyrics: "" },
  { time: "185.843", word: "だが", lyrics: "ダ・ガ" },
  {
    time: "187.789",
    word: "みつめあうままでせかいはふたりだけ",
    lyrics: "見つめ合うままで 世界は2人だけ",
  },
  { time: "193.013", word: "かまわないでくれ", lyrics: "かまわないでくれ" },
  { time: "194.954", word: "そんなきれいごとわかってる", lyrics: "そんな綺麗事 分かってる" },
  {
    time: "198.357",
    word: "すばらしきかなほんとうもうそもごちゃまぜにしてよ",
    lyrics: "素晴らしきかな 本当も嘘もごちゃ混ぜにしてよ",
  },
  { time: "203.822", word: "oohままwoo", lyrics: "oohママwoo" },
  { time: "205.876", word: "", lyrics: "" },
  { time: "207.370", word: "", lyrics: "end" },
  { time: "214.101", word: "", lyrics: "end" },
];

export default Content;
