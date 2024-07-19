import { ROMA_MAP } from "./const/romaMap";
import { LineData, MapData, SpeedDifficulty, TypeChank } from "./type";

const ZENKAKU_LIST = [
  "０",
  "１",
  "２",
  "３",
  "４",
  "５",
  "６",
  "７",
  "８",
  "９",
  "Ａ",
  "Ｂ",
  "Ｃ",
  "Ｄ",
  "Ｅ",
  "Ｆ",
  "Ｇ",
  "Ｈ",
  "Ｉ",
  "Ｊ",
  "Ｋ",
  "Ｌ",
  "Ｍ",
  "Ｎ",
  "Ｏ",
  "Ｐ",
  "Ｑ",
  "Ｒ",
  "Ｓ",
  "Ｔ",
  "Ｕ",
  "Ｖ",
  "Ｗ",
  "Ｘ",
  "Ｙ",
  "Ｚ",
  "ａ",
  "ｂ",
  "ｃ",
  "ｄ",
  "ｅ",
  "ｆ",
  "ｇ",
  "ｈ",
  "ｉ",
  "ｊ",
  "ｋ",
  "ｌ",
  "ｍ",
  "ｎ",
  "ｏ",
  "ｐ",
  "ｑ",
  "ｒ",
  "ｓ",
  "ｔ",
  "ｕ",
  "ｖ",
  "ｗ",
  "ｘ",
  "ｙ",
  "ｚ",
  "～",
  "＆",
  "％",
  "！",
  "？",
  "＠",
  "＃",
  "＄",
  "（",
  "）",
  "｜",
  "｛",
  "｝",
  "｀",
  "＊",
  "＋",
  "：",
  "；",
  "＿",
  "＜",
  "＞",
  "＝",
  "＾",
];
const NN_LIST = [
  "あ",
  "い",
  "う",
  "え",
  "お",
  "な",
  "に",
  "ぬ",
  "ね",
  "の",
  "や",
  "ゆ",
  "よ",
  "ん",
  "'",
  "’",
  "a",
  "i",
  "u",
  "e",
  "o",
  "y",
  "n",
];
const SOKUON_JOIN_LIST = [
  "ヰ",
  "ゐ",
  "ヱ",
  "ゑ",
  "ぁ",
  "ぃ",
  "ぅ",
  "ぇ",
  "ぉ",
  "ゃ",
  "ゅ",
  "ょ",
  "っ",
  "ゎ",
  "ヵ",
  "ヶ",
  "ゔ",
  "か",
  "き",
  "く",
  "け",
  "こ",
  "さ",
  "し",
  "す",
  "せ",
  "そ",
  "た",
  "ち",
  "つ",
  "て",
  "と",
  "は",
  "ひ",
  "ふ",
  "へ",
  "ほ",
  "ま",
  "み",
  "む",
  "め",
  "も",
  "や",
  "ゆ",
  "よ",
  "ら",
  "り",
  "る",
  "れ",
  "ろ",
  "わ",
  "を",
  "が",
  "ぎ",
  "ぐ",
  "げ",
  "ご",
  "ざ",
  "じ",
  "ず",
  "ぜ",
  "ぞ",
  "だ",
  "ぢ",
  "づ",
  "で",
  "ど",
  "ば",
  "び",
  "ぶ",
  "べ",
  "ぼ",
  "ぱ",
  "ぴ",
  "ぷ",
  "ぺ",
  "ぽ",
];
const SYMBOL_LIST = [
  ",",
  ".",
  "/",
  '"',
  "'",
  "[",
  "]",
  "z[",
  "z]",
  "!",
  "?",
  "^",
  "|",
  "(",
  ")",
  "`",
  ":",
  ";",
  "<",
  ">",
  "_",
  "~",
  "{",
  "}",
  " ",
  "#",
  "$",
  "%",
  "&",
  "=",
  "*",
  "+",
  "@",
  "\\",
];

const CHAR_POINT = 10;

class TypingWords {
  typingWords: LineData[];
  startLine: number;
  lineLength: number;

  constructor(wordRomaMap: string[], data: MapData) {
    const result = this.create(wordRomaMap, data);

    this.typingWords = result.typingWords;
    this.startLine = result.startLine;
    this.lineLength = result.lineLength;
  }

  create(wordRomaMap: string[], data: MapData) {
    const typingWords: LineData[] = []; // 修正
    let startLine = 0;
    let lineLength = 0;
    for (let i = 0; i < data.length; i++) {
      const time = data[i]["time"];
      const lyrics = data[i]["lyrics"];

      if (wordRomaMap[i] && lyrics != "end") {
        if (startLine == 0) {
          startLine = i;
        }
        lineLength++;
        const remainTime = +data[i + 1]["time"] - +time;

        const arr: LineData = this.hiraganaToRomaArray(wordRomaMap[i], time, lyrics, remainTime);
        typingWords.push(arr);
      } else {
        typingWords.push({
          time,
          lyrics,
          word: [{ k: "", r: [""], p: 0 }],
          kpm: { k: 0, r: 0 },
          notes: { k: 0, r: 0 },
        });
      }
    }

    return { typingWords, startLine, lineLength };
  }

  hiraganaToRomaArray(str: string, time: string, lyrics: string, remainTime: number) {
    let word: TypeChank[] = [];

    const wordIndexs = str.split("\t").filter((word) => word > "");
    const STR_LEN = wordIndexs.length;

    for (let i = 0; i < STR_LEN; i++) {
      if (!isNaN(Number(wordIndexs[i]))) {
      }
      const CHAR = structuredClone(ROMA_MAP[parseInt(wordIndexs[i])]);
      if (CHAR) {
        word.push({ ...CHAR, p: CHAR_POINT * CHAR["r"][0].length });

        //促音の打鍵パターン
        if (word.length >= 2) {
          const PREVIOUS_KANA = word[word.length - 2]["k"];

          if (PREVIOUS_KANA && PREVIOUS_KANA[PREVIOUS_KANA.length - 1] == "っ") {
            const KANA = word[word.length - 1]["k"][0];

            if (SOKUON_JOIN_LIST.includes(KANA)) {
              word = this.joinSokuonPattern("", word);
            } else if (["い", "う", "ん"].includes(KANA)) {
              word = this.joinSokuonPattern("iunFlag", word);
            }
          }
        }

        //n→nn変換
        word = this.nConvert_nn(word);

        //記号の種類をカウント
        // this.symbolCounter();
      } else {
        //打鍵パターン生成を行わなくて良い文字はそのままthis.typingArrayに追加
        for (let v = 0; v < wordIndexs[i].length; v++) {
          let char: string = wordIndexs[i][v];

          //全角→半角に変換(英数字記号)
          if (ZENKAKU_LIST.includes(wordIndexs[i][v])) {
            char = String.fromCharCode(char.charCodeAt(0) - 0xfee0);
          }

          //追加
          word.push({ k: char, r: [char], p: CHAR_POINT * char.length });

          //n→nn変換
          if (v == 0) {
            word = this.nConvert_nn(word);
          }

          // this.symbolCounter();
        }
      }
    }

    //this.kanaArray最後の文字が「ん」だった場合も[nn]に置き換えます。
    if (word[word.length - 1]["k"] == "ん") {
      word[word.length - 1]["r"][0] = "nn";
      word[word.length - 1]["r"].push("n'");
    }

    const notes = this.notes(word);
    const kpm = this.kpm(notes, remainTime);

    return { time, lyrics, word, notes, kpm };
  }

  //'っ','か' → 'っか'等の繋げられる促音をつなげる
  joinSokuonPattern(iunFlag: string, lineWord: { k: string; r: string[]; p: number }[]) {
    const PREVIOUS_KANA = lineWord[lineWord.length - 2]["k"];
    const KANA = lineWord[lineWord.length - 1]["k"];

    lineWord[lineWord.length - 1]["k"] = PREVIOUS_KANA + KANA;
    lineWord.splice(-2, 1);

    let repeat: string[] = [];
    let xtu: string[] = [];
    let ltu: string[] = [];
    let xtsu: string[] = [];
    let ltsu: string[] = [];

    const XTU_LEN = (PREVIOUS_KANA.match(/っ/g) || []).length;
    const ROMA_LEN = lineWord[lineWord.length - 1]["r"].length;
    //変数に値渡し？して処理する方がわかりやすい(後でリファクタリング)
    for (let i = 0; i < ROMA_LEN; i++) {
      if (!iunFlag || !["i", "u", "n"].includes(lineWord[lineWord.length - 1]["r"][i][0])) {
        repeat.push(
          lineWord[lineWord.length - 1]["r"][i][0].repeat(XTU_LEN) +
            lineWord[lineWord.length - 1]["r"][i],
        );
      }

      xtu.push("x".repeat(XTU_LEN) + "tu" + lineWord[lineWord.length - 1]["r"][i]);
      ltu.push("l".repeat(XTU_LEN) + "tu" + lineWord[lineWord.length - 1]["r"][i]);
      xtsu.push("x".repeat(XTU_LEN) + "tsu" + lineWord[lineWord.length - 1]["r"][i]);
      ltsu.push("l".repeat(XTU_LEN) + "tsu" + lineWord[lineWord.length - 1]["r"][i]);
    }

    lineWord[lineWord.length - 1]["r"] = [...repeat, ...xtu, ...ltu, ...xtsu, ...ltsu];

    return lineWord;
  }

  nConvert_nn(lineWord: TypeChank[]) {
    //n→nn変換
    const PREVIOUS_KANA = lineWord.length >= 2 ? lineWord[lineWord.length - 2]["k"] : false;

    if (PREVIOUS_KANA && PREVIOUS_KANA[PREVIOUS_KANA.length - 1] == "ん") {
      if (NN_LIST.includes(lineWord[lineWord.length - 1]["k"])) {
        for (let i = 0; i < lineWord[lineWord.length - 2]["r"].length; i++) {
          const ROMA_PATTERN = lineWord[lineWord.length - 2]["r"][i];
          const IS_N =
            (ROMA_PATTERN.length >= 2 &&
              ROMA_PATTERN[ROMA_PATTERN.length - 2] != "x" &&
              ROMA_PATTERN[ROMA_PATTERN.length - 1] == "n") ||
            ROMA_PATTERN == "n";

          if (IS_N) {
            lineWord[lineWord.length - 2]["r"][i] = lineWord[lineWord.length - 2]["r"][i] + "n";
            lineWord[lineWord.length - 2]["r"].push("n'");
          }
        }

        //それ以外の文字でもnnの入力を可能にする
      } else if (lineWord[lineWord.length - 1]["k"]) {
        const ROMA_PATTERN_LEN = lineWord[lineWord.length - 1]["r"].length;

        for (let i = 0; i < ROMA_PATTERN_LEN; i++) {
          lineWord[lineWord.length - 1]["r"].push("n" + lineWord[lineWord.length - 1]["r"][i]);
          lineWord[lineWord.length - 1]["r"].push("'" + lineWord[lineWord.length - 1]["r"][i]);
        }
      }
    }

    return lineWord;
  }

  kpm(notes: { k: number; r: number }, remainTime: number) {
    const romaKpm = Math.round((notes.r / remainTime) * 60);
    const kanaKpm = Math.round((notes.k / remainTime) * 60);
    return { r: romaKpm, k: kanaKpm };
  }

  notes(word: TypeChank[]) {
    const kanaWord = word.map((item) => item.k);
    const dakuHandakuLineNotes = (
      kanaWord
        .join("")
        .match(
          /[ゔ|が|ぎ|ぐ|げ|ご|ざ|じ|ず|ぜ|ぞ|だ|ぢ|づ|で|ど|ば|び|ぶ|べ|ぼ|ぱ|ぴ|ぷ|ぺ|ぽ]/g,
        ) || []
    ).length;
    const kanaNotes = kanaWord.join("").length + dakuHandakuLineNotes;

    const romaWord = word.map((item) => item.r[0]);

    return { k: kanaNotes, r: romaWord.join("").length };
  }
}

export class CreateMap {
  typingWords: LineData[];

  startLine: number;
  lineLength: number;
  totalNotes: { r: number; k: number };
  speedDifficulty: SpeedDifficulty;
  currentTimeBarFrequency: number;
  movieTotalTime: number;

  constructor(data: MapData) {
    const wordRomaMap = this.parseWord(data);

    const result = new TypingWords(wordRomaMap, data);

    this.typingWords = result.typingWords;
    this.startLine = result.startLine;
    this.lineLength = result.lineLength;

    this.totalNotes = this.calculateTotalNotes(result.typingWords);
    this.speedDifficulty = this.calculateSpeedDifficulty(result.typingWords);

    this.movieTotalTime = +this.typingWords[result.typingWords.length - 1].time;
    this.currentTimeBarFrequency = this.movieTotalTime / 1700;
  }

  parseWord(data: MapData) {
    let lyrics = data
      .map((line) => line["word"].replace(/[ 　]+$/, "").replace(/^[ 　]+/, ""))
      .join("\n")
      .replace(/…/g, "...")
      .replace(/‥/g, "..")
      .replace(/･/g, "・")
      .replace(/〜/g, "～")
      .replace(/｢/g, "「")
      .replace(/｣/g, "」")
      .replace(/､/g, "、")
      .replace(/｡/g, "。")
      .replace(/　/g, " ")
      .replace(/ {2,}/g, " ")
      .replace(/ヴ/g, "ゔ")
      .replace(/－/g, "ー");

    const ROMA_MAP_LEN = ROMA_MAP.length;

    for (let i = 0; i < ROMA_MAP_LEN; i++) {
      lyrics = lyrics.replace(RegExp(ROMA_MAP[i]["k"], "g"), "\t" + i + "\t");
    }

    const lyricsArray = lyrics.split("\n");

    return lyricsArray;
  }

  calculateTotalNotes(typingWords: LineData[]) {
    return typingWords.reduce(
      (acc, line) => {
        acc.k += line.notes.k;
        acc.r += line.notes.r;
        return acc;
      },
      { k: 0, r: 0 },
    );
  }

  calculateSpeedDifficulty(typingWords: LineData[]) {
    const romaSpeedList = typingWords.map((line) => line.kpm.r);
    const kanaSpeedList = typingWords.map((line) => line.kpm.k);

    const romaMedianSpeed = this.median(romaSpeedList);
    const kanaMedianSpeed = this.median(kanaSpeedList);
    const romaMaxSpeed = Math.max(...romaSpeedList);
    const kanaMaxSpeed = Math.max(...kanaSpeedList);

    return {
      median: { r: romaMedianSpeed, k: kanaMedianSpeed },
      max: { r: romaMaxSpeed, k: kanaMaxSpeed },
    };
  }

  median(arr) {
    arr = arr.filter(function (a) {
      return a !== 0;
    });
    var half = (arr.length / 2) | 0;
    var temp = arr.sort((a, b) => a - b);

    if (temp.length % 2) {
      return temp[half];
    }

    return (temp[half - 1] + temp[half]) / 2;
  }
}
