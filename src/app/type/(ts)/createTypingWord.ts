import { Line } from "@/types";
import { ROMA_MAP } from "./const/romaMap";

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

const CHAR_POINT = 5;

//symbolCount無効になってる
class ParseLyrics {
  data: { time: string; lyrics: string; word: string }[];
  typePattern: { k: string; r: string[]; p: number }[][];
  // symbolCount: { [key: string]: number };

  constructor(data: { time: string; lyrics: string; word: string }[]) {
    this.data = data;
    this.typePattern = [];
    // this.symbolCount = {};
  }
  joinLyrics() {
    let lyrics = this.data
      .map((line) => line["word"].replace(/[ 　]+$/, "").replace(/^[ 　]+/, ""))
      .join("\n");

    lyrics = lyrics
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

    return lyrics;
  }

  createWord(lyrics) {
    const ROMA_MAP_LEN = ROMA_MAP.length;

    for (let i = 0; i < ROMA_MAP_LEN; i++) {
      lyrics = lyrics.replace(RegExp(ROMA_MAP[i]["k"], "g"), "\t" + i + "\t");
    }

    lyrics = lyrics.split("\n");

    for (let i = 0; i < this.data.length; i++) {
      if (lyrics[i] && this.data[i]["lyrics"] != "end") {
        const arr: { k: string; r: string[]; p: number }[] = this.hiraganaToRomaArray(lyrics[i]);
        this.typePattern.push(arr);
      } else {
        this.typePattern.push([{ k: "", r: [""], p: 0 }]);
      }
    }
  }

  hiraganaToRomaArray(str) {
    let lineWord: { k: string; r: string[]; p: number }[] = [];

    str = str.split("\t").filter((word) => word > "");
    const STR_LEN = str.length;

    for (let i = 0; i < STR_LEN; i++) {
      if (!isNaN(Number(str[i]))) {
      }
      const CHAR = structuredClone(ROMA_MAP[parseInt(str[i])]);
      if (CHAR) {
        lineWord.push({ ...CHAR, p: CHAR_POINT * CHAR["r"][0].length });

        //促音の打鍵パターン
        if (lineWord.length >= 2) {
          const PREVIOUS_KANA = lineWord[lineWord.length - 2]["k"];

          if (PREVIOUS_KANA && PREVIOUS_KANA[PREVIOUS_KANA.length - 1] == "っ") {
            const KANA = lineWord[lineWord.length - 1]["k"][0];

            if (SOKUON_JOIN_LIST.includes(KANA)) {
              lineWord = this.joinSokuonPattern("", lineWord);
            } else if (["い", "う", "ん"].includes(KANA)) {
              lineWord = this.joinSokuonPattern("iunFlag", lineWord);
            }
          }
        }

        //n→nn変換
        lineWord = this.nConvert_nn(lineWord);

        //記号の種類をカウント
        // this.symbolCounter();
      } else {
        //打鍵パターン生成を行わなくて良い文字はそのままthis.typingArrayに追加
        for (let v = 0; v < str[i].length; v++) {
          let char: string = str[i][v];

          //全角→半角に変換(英数字記号)
          if (ZENKAKU_LIST.includes(str[i][v])) {
            char = String.fromCharCode(char.charCodeAt(0) - 0xfee0);
          }

          //追加
          lineWord.push({ k: char, r: [char], p: CHAR_POINT * char.length });

          //n→nn変換
          if (v == 0) {
            lineWord = this.nConvert_nn(lineWord);
          }

          // this.symbolCounter();
        }
      }
    }

    //this.kanaArray最後の文字が「ん」だった場合も[nn]に置き換えます。
    if (lineWord[lineWord.length - 1]["k"] == "ん") {
      lineWord[lineWord.length - 1]["r"][0] = "nn";
      lineWord[lineWord.length - 1]["r"].push("n'");
    }

    return lineWord;
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

  nConvert_nn(lineWord: { k: string; r: string[]; p: number }[]) {
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

  // symbolCounter() {
  //   const symbolEncount = SYMBOL_LIST.indexOf(this.lineWord[this.lineWord.length - 1]["r"][0]);

  //   if (symbolEncount > -1) {
  //     if (this.symbolCount[this.lineWord[this.lineWord.length - 1]["k"]]) {
  //       this.symbolCount[this.lineWord[this.lineWord.length - 1]["k"]]++;
  //     } else {
  //       this.symbolCount[this.lineWord[this.lineWord.length - 1]["k"]] = 1;
  //     }
  //   }
  // }
}

export class CreateMap extends ParseLyrics {
  scoreParChar: number;
  missPenalty: number;
  startLine: number;
  lineLength: number;
  romaTotalNotes: number;
  kanaTotalNotes: number;
  romaLineNotesList: number[];
  kanaLineNotesList: number[];

  romaMedianSpeed: number;
  kanaMedianSpeed: number;
  romaMaxSpeed: number;
  kanaMaxSpeed: number;
  romaLineSpeedList: number[];
  kanaLineSpeedList: number[];
  movieTotalTime: number;
  movieTimeMM: number;
  movieTimeSS: number;
  constructor(data: Line[]) {
    super(data);

    this.scoreParChar = 0;
    this.missPenalty = 0;

    this.startLine = 0;

    //count
    this.lineLength = 0;
    this.romaTotalNotes = 0;
    this.kanaTotalNotes = 0;
    this.romaLineNotesList = [];
    this.kanaLineNotesList = [];

    //typeSpeed
    this.romaMedianSpeed = 0;
    this.kanaMedianSpeed = 0;
    this.romaMaxSpeed = 0;
    this.kanaMaxSpeed = 0;
    this.romaLineSpeedList = [];
    this.kanaLineSpeedList = [];

    //totalTime
    this.movieTotalTime = 0;
    this.movieTimeMM = 0;
    this.movieTimeSS = 0;

    //movieSpeedController = new MovieSpeedController()
    //movieSpeedController.addEvent()

    this.createWord(this.joinLyrics());
    this.getScorePerChar();
  }

  // setTotalTime(endTime: number) {
  //   const TIME = endTime // / speed.value;
  //   typeArea.value.durationTime = TIME;
  //   timer.currentTimeBarFrequency = TIME / 1700; //1700 = 更新頻度の閾値
  // }

  getScorePerChar() {
    const LINE_LEN = this.data.length;

    for (let i = 0; i < LINE_LEN; i++) {
      let romaLineNotes = 0;
      let kanaLineNotes = 0;
      let dakuHandakuLineNotes = 0;
      let lineSpeed = 0;

      //ワード結合
      let kanaWord: string[] = [];
      let romaWord: string[] = [];

      if (this.data[i]["lyrics"] != "end" && this.typePattern[i].length) {
        if (this.startLine == 0) {
          this.startLine = i;
        }

        this.lineLength++;
        lineSpeed = +this.data[i + 1]["time"] - +this.data[i]["time"];

        kanaWord = this.typePattern[i].map((item) => item.k);
        romaWord = this.typePattern[i].map((item) => item.r[0]);
        //かな入力
        dakuHandakuLineNotes = (
          kanaWord
            .join("")
            .match(
              /[ゔ|が|ぎ|ぐ|げ|ご|ざ|じ|ず|ぜ|ぞ|だ|ぢ|づ|で|ど|ば|び|ぶ|べ|ぼ|ぱ|ぴ|ぷ|ぺ|ぽ]/g,
            ) || []
        ).length;
        kanaLineNotes = kanaWord.join("").length;
        this.kanaTotalNotes += kanaLineNotes + dakuHandakuLineNotes;

        //ローマ字入力
        romaLineNotes = romaWord.join("").length;
        this.romaTotalNotes += romaLineNotes;
      } else if (this.data[i]["lyrics"] == "end") {
        this.romaMedianSpeed = this.median(this.romaLineSpeedList);
        this.kanaMedianSpeed = this.median(this.kanaLineSpeedList);
        this.romaMaxSpeed = Math.max(...this.romaLineSpeedList);
        this.kanaMaxSpeed = Math.max(...this.kanaLineSpeedList);

        this.scoreParChar = 100 / this.romaTotalNotes;
        this.missPenalty = this.scoreParChar / 4;
        this.movieTotalTime = +this.data[i].time;
        // this.setTotalTime(this.movieTotalTime);

        // status.value.lineCount = this.lineLength;
        // result.value = new Result(LINE_LEN);
        // if(movieSpeedController.fixedSpeed){
        // 	movieSpeedController.speed = movieSpeedController.fixedSpeed
        // 	movieSpeedController.playSpeed = movieSpeedController.fixedSpeed;
        // }
        break;
      }

      this.kanaLineNotesList.push(kanaLineNotes + dakuHandakuLineNotes);
      this.romaLineNotesList.push(romaLineNotes);
      this.romaLineSpeedList.push(
        lineSpeed > 0 ? Math.round((romaLineNotes / lineSpeed) * 100) / 100 : 0,
      );
      this.kanaLineSpeedList.push(
        lineSpeed > 0
          ? Math.round(((kanaLineNotes + dakuHandakuLineNotes) / lineSpeed) * 100) / 100
          : 0,
      );
    }

    return;
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
