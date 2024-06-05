const nonSymbol: string[] = [
  " ",
  "ー",
  "'",
  "＇",
  "%",
  "％",
  "&",
  "＆",
  "@",
  "＠",
];
const addSymbol: string[] = [
  ",",
  ".",
  "、",
  "。",
  "，",
  "．",
  "-",
  "!",
  "?",
  "！",
  "？",
  "~",
  "～",
  "#",
  "＃",
  "$",
  "＄",
  "=",
  "＝",
  "*",
  "＊",
  "+",
  "＋",
  "/",
  "・",
  "￥",
];
const addSymbolAll: string[] = [
  '"',
  "＂",
  "[",
  "]",
  "『",
  "』",
  "「",
  "」",
  "［",
  "］",
  "^",
  "＾",
  "|",
  "｜",
  "（",
  "）",
  "(",
  ")",
  "`",
  "｀",
  ":",
  "：",
  ";",
  "；",
  "<",
  "＜",
  ">",
  "＞",
  "_",
  "＿",
  "{",
  "｛",
  "}",
  "｝",
];

export class WordConvert {
  symbolList: string[];
  convertMode: string;
  constructor() {
    this.symbolList = [];
    this.convertMode = "non_symbol";
  }

  async convert(lyrics: string, convertMode: string) {
    lyrics = this.wordFormat(lyrics);
    this.convertMode = convertMode;
    this.symbolList = this.createSymbolList();
    const WORD = await this.postMorphAPI(lyrics);

    return WORD;
  }

  wordFormat(Lyric) {
    const ruby_convert = Lyric.match(/<*ruby(?: .+?)?>.*?<*\/ruby*>/g);

    if (ruby_convert) {
      for (let v = 0; v < ruby_convert.length; v++) {
        const start = ruby_convert[v].indexOf("<rt>") + 4;
        const end = ruby_convert[v].indexOf("</rt>");
        const ruby = ruby_convert[v].slice(start, end);
        Lyric = Lyric.replace(ruby_convert[v], ruby);
      }
    }

    return Lyric.replace(/[ 　]+$/, "")
      .replace(/^[ 　]+/, "")
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
  }

  createSymbolList() {
    let result: string[] = [...nonSymbol];
    if (this.convertMode.match("add_symbol")) {
      result = result.concat(addSymbol as string[]);
    }
    if (this.convertMode == "add_symbol_all") {
      result = result.concat(addSymbolAll as string[]);
    }
    return result;
  }

  async postMorphAPI(SENTENCE: string) {
    const APIKEY =
      "48049f223f8d9169a08de4e3bba21f64e4c17a7771620c1b8bb20574b87ea813";
    const BASE_URL = "https://labs.goo.ne.jp/api/morph";

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        app_id: APIKEY,
        sentence: JSON.stringify(SENTENCE),
        info_filter: "form|read",
      }),
    };

    try {
      const response = await fetch(BASE_URL, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();

      let LIST = responseData.word_list[0];
      LIST.shift();
      LIST.pop();

      return this.createWord(LIST).join("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }

  createWord(LIST: [string, string][]) {
    let result: string[] = [];

    for (let i = 0; i < LIST.length; i++) {
      const IS_ZENKAKU = LIST[i][0].match(/^[^\x01-\x7E\xA1-\xDF]+$/);
      const IS_ADD_SYMBOL = this.symbolList.includes(LIST[i][0]);
      const IS_SYMBOL = nonSymbol
        .concat(addSymbol)
        .concat(addSymbolAll)
        .includes(LIST[i][0]);
      if (IS_ADD_SYMBOL) {
        //記号
        //半角の後にスペースがある場合はスペース挿入
        if (this.convertMode != "add_symbol_all" && LIST[i][0] == " ") {
          const IS_HANKAKU = !LIST[i - 1][0].match(/^[^\x01-\x7E\xA1-\xDF]+$/);
          if (IS_HANKAKU) {
            result.push(LIST[i][0]);
          }
        } else {
          result.push(LIST[i][0]);
        }
      } else if (IS_ZENKAKU) {
        // 全角文字の時の処理を記述
        result.push(this.kanaToHira(LIST[i][1]));
      } else {
        // 半角文字の時の処理を記述
        const NON_ADD_SYMBOL =
          LIST[i][0] == "\\" || (!IS_ADD_SYMBOL && IS_SYMBOL);
        if (NON_ADD_SYMBOL) {
          continue;
        }
        result.push(LIST[i][0]);
      }
    }

    return result;
  }

  kanaToHira(str: string) {
    return str.replace(/[\u30a1-\u30f6]/g, function (match) {
      var chr = match.charCodeAt(0) - 0x60;
      return String.fromCharCode(chr);
    });
  }
}
