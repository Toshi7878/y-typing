import React from "react";
import { RefsProvider } from "../(contexts)/refsProvider";
import Content, { FetchMapData } from "./content";

async function fetchMapData(id: string): Promise<FetchMapData> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/map?id=${id}`, {
    cache: "no-cache",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}

export default async function Page({ params }: { params: { id: string } }) {
  // const mapData = await fetchMapData(params.id);

  const mapData = {
    videoId: "2b1IexhKPz4",
    title: "きゅうくらりん / いよわ feat.可不（Kyu-kurarin / Iyowa feat.Kafu）",
    creatorComment: "",
    genre: "",
    Tags: ["a", "b", "c"],
    mapData: [
      { time: "0", word: "", lyrics: "" },
      {
        time: "21.68",
        word: "うるさくないたもじばんをみてた",
        lyrics: "うるさく鳴いた 文字盤を見てた",
      },
      {
        time: "26.03",
        word: "きっときっとかがみごしはちじすぎのにおい",
        lyrics: "きっときっと鏡越し <ruby>8時<rt>はちじ</rt></ruby>過ぎのにおい",
      },
      {
        time: "30.39",
        word: "しらけたかおかわってなくてよかった",
        lyrics: "しらけた顔 変わってなくてよかった",
      },
      {
        time: "34.78",
        word: "ぴんくのうえきばちのぐちょぐちょしたこころの",
        lyrics: "ピンクの植木鉢の ぐちょぐちょした心の",
      },
      { time: "39.11", word: "そばにおおきくそだったもの", lyrics: "そばに 大きく育ったもの" },
      {
        time: "43.78",
        word: "むすばれたつぼみがこんなにもおろかしい",
        lyrics: "結ばれたつぼみが こんなにも愚かしい",
      },
      {
        time: "47.8700",
        word: "ああかせきになっちまうよああとりつくろっていたいな",
        lyrics: "ああ 化石になっちまうよ ああ 取り繕っていたいな",
      },
      {
        time: "52.22",
        word: "ちゃんとわらえなきゃねたいしたとりえもないから",
        lyrics: "ちゃんと笑えなきゃね 大した取り柄も無いから",
      },
      {
        time: "56.59",
        word: "からっぽがうまらないことぜんぶばれてたらどうしよう",
        lyrics: "空っぽが埋まらないこと 全部ばれてたらどうしよう",
      },
      {
        time: "60.68",
        word: "あああなたのみぎどなりわたしきゅうくらりん",
        lyrics: "ああ あなたの右どなり わたし きゅうくらりん",
      },
      { time: "65.34", word: "", lyrics: "" },
      { time: "81.01", word: "たとえばこんやねむって", lyrics: "例えば 今夜眠って" },
      {
        time: "85.22",
        word: "めざめたときにおきるりゆうが",
        lyrics: "目覚めたときに 起きる理由が",
      },
      { time: "88.68", word: "ひとつもみつからない", lyrics: "ひとつも 見つからない" },
      {
        time: "93.83",
        word: "あさがきたらわたしはどうする",
        lyrics: "朝が来たら わたしは どうする？",
      },
      {
        time: "99.14",
        word: "うるさくないたもじばんをみてた",
        lyrics: "うるさく鳴いた 文字盤を見てた",
      },
      {
        time: "103.5",
        word: "いっぽいっぽあとずさりまたあしたねとぽつり",
        lyrics: "一歩一歩あとずさり 「また<ruby>明日<rt>あした</rt></ruby>ね」とぽつり",
      },
      {
        time: "107.85",
        word: "よろこびよりあんどがさきにきちゃった",
        lyrics: "喜びより 安堵が先に来ちゃった",
      },
      {
        time: "112.22",
        word: "おもいでにしびごしうつるこまかなひびが",
        lyrics: "思い出 西日越し うつる こまかなヒビが",
      },
      { time: "116.84", word: "こんなにもおそろしい", lyrics: "こんなにも 恐ろしい" },
      {
        time: "118.78",
        word: "あああなたがしってしまうああとりつくろっていたいな",
        lyrics: "ああ あなたが知ってしまう ああ 取り繕っていたいな",
      },
      {
        time: "122.86",
        word: "ちゃんとわらえなきゃねたいせつがこわれちゃうから",
        lyrics: "ちゃんと笑えなきゃね 大切が壊れちゃうから",
      },
      {
        time: "127.07",
        word: "しあわせなあすをねがうけどそこなしのこどくをどうしよう",
        lyrics: "幸せな<ruby>明日<rt>あす</rt></ruby>を願うけど 底なしの孤独をどうしよう",
      },
      {
        time: "131.31",
        word: "もううめきごえしかでないわたしぎゅうぐらりん",
        lyrics: "もう うめき声しか出ない わたし ぎゅうぐらりん",
      },
      { time: "136.02", word: "", lyrics: "" },
      { time: "153.4", word: "ああにじがかかってるそら", lyrics: "ああ 虹がかかってる空" },
      { time: "157.68", word: "きれいとおもいたくて", lyrics: "きれいと思いたくて" },
      {
        time: "162.15",
        word: "こがれてはにげられないことみんなにはくだらないこと",
        lyrics: "焦がれては逃げられないこと みんなにはくだらないこと",
      },
      {
        time: "166.47",
        word: "もうどうしようもないのわたしきゅうくらりん",
        lyrics: "もう どうしようもないの わたし きゅうくらりん",
      },
      { time: "170.82", word: "そばにたぐりよせたまつろ", lyrics: "そばに たぐりよせた末路" },
      {
        time: "175.5",
        word: "かれおちたつぼみがこんなにもけがらわしくていじらしい",
        lyrics: "枯れ落ちた つぼみが こんなにも汚らわしくて いじらしい",
      },
      {
        time: "180.68",
        word: "ああのろいになっちまうよあああきらめたっていわなくちゃ",
        lyrics: "ああ 呪いになっちまうよ ああ 「あきらめた」って言わなくちゃ",
      },
      {
        time: "185.46",
        word: "あたまのなかでのいずがなりやまないから",
        lyrics: "頭の中で ノイズが鳴りやまないから",
      },
      {
        time: "189.41",
        word: "からっぽがうまらないことぜんぶばれてたらどうしよう",
        lyrics: "空っぽが埋まらないこと 全部ばれてたらどうしよう",
      },
      {
        time: "193.5",
        word: "あああのこのいうとおりおわりなんだ",
        lyrics: "ああ あの子の言うとおり 終わりなんだ",
      },
      {
        time: "197.03",
        word: "ああしあわせになっちまうよああうしなうのがつらいな",
        lyrics: "ああ 幸せになっちまうよ ああ 失うのがつらいな",
      },
      {
        time: "201.38",
        word: "ぜんぶむだになったらあいしたばつをうけるから",
        lyrics: "全部ムダになったら 愛した罰を受けるから",
      },
      {
        time: "205.75",
        word: "ひどくやさしいあなたのむねでなけたならどうしよう",
        lyrics: "ひどく優しいあなたの 胸で泣けたならどうしよう",
      },
      {
        time: "209.85",
        word: "さいごみたのはそんなゆめわたしちゅうぶらりん",
        lyrics: "最後見たのはそんな夢 わたし ちゅうぶらりん",
      },
      { time: "214.27", word: "", lyrics: "" },
      { time: "216.081", word: "", lyrics: "end" },
      { time: "217", word: "", lyrics: "end" },
    ],
  };

  return (
    <RefsProvider>
      <Content data={mapData} />
    </RefsProvider>
  );
}
