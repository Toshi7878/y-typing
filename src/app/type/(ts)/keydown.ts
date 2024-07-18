import {
  Dakuten,
  HanDakuten,
  InputModeType,
  NormalizeHirakana,
  PlayingRef,
  Status,
  StatusRef,
  WordType,
} from "./type";
import { CreateMap } from "./createTypingWord";
import { SkipGuideRef } from "../components/(typing-area)/scene/child/child/PlayingSkipGuide";
import { CalcTypeSpeed } from "./calcTypeSpeed";
import { PlayingComboRef } from "../components/(typing-area)/scene/child/child/PlayingCombo";
import { KANA_CODE_MAP, KANA_KEY_MAP } from "./const/kanaKeyMap";
import { normalize } from "path";

const keyboardCharacters = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "~",
  "&",
  "%",
  "!",
  "?",
  "@",
  "#",
  "$",
  "(",
  ")",
  "|",
  "{",
  "}",
  "`",
  "*",
  "+",
  ":",
  ";",
  "_",
  "<",
  ">",
  "=",
  "^",
];

const dakuKanaList = [
  "ゔ",
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
];
const handakuKanaList = ["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"];

const dakuHandakuList = dakuKanaList.concat(handakuKanaList);
const yoonFlickList = ["ぁ", "ぃ", "ぅ", "ぇ", "ぉ", "ゃ", "ゅ", "ょ", "っ", "ゎ"];
const yoonFlickListLarge = ["あ", "い", "う", "え", "お", "や", "ゆ", "よ", "つ", "わ"];
const smallKanaList = [
  "っ",
  "ぁ",
  "ぃ",
  "ぅ",
  "ぇ",
  "ぉ",
  "ゃ",
  "ゅ",
  "ょ",
  "ゎ",
  "ヵ",
  "ヶ",
  "ん",
];
const OptimisationWhiteList = ["っっ", "っん", "っい", "っう"];

const kana_mode_convert_rule_before = ["←", "↓", "↑", "→", "『", "』"];
const kana_mode_convert_rule_after = ["ひだり", "した", "うえ", "みぎ", "「", "」"];

interface CharsType {
  keys: string[];
  shift: boolean;
}

interface JudgeType {
  chars: CharsType;
  lineWord: WordType;
}
class RomaInput {
  newLineWord: WordType;
  updatePoint: number;
  successKey: string;
  constructor({ chars, lineWord }: JudgeType) {
    this.updatePoint = 0;
    const result = this.hasRomaPattern(chars, lineWord);
    this.newLineWord = result.newLineWord as WordType;
    this.successKey = result.successKey;
  }
  hasRomaPattern(chars: CharsType, lineWord: WordType) {
    let newLineWord = { ...lineWord } as WordType;
    const nextRomaPattern: string[] = newLineWord.nextChar["r"];
    const kana = lineWord.nextChar["k"];
    const IS_SUCCESS = nextRomaPattern.some(
      (pattern) => pattern[0].toLowerCase() === chars["keys"][0],
    );

    if (!IS_SUCCESS) {
      return { newLineWord, successKey: "" };
    }

    if (kana == "ん" && newLineWord.word[0]) {
      newLineWord.word[0]["r"] = this.nextNNFilter(chars["keys"][0], newLineWord);
    }

    newLineWord.nextChar["r"] = this.updateNextRomaPattern(chars, nextRomaPattern);
    newLineWord = this.kanaFilter(kana, chars["keys"][0], nextRomaPattern, newLineWord);

    newLineWord = this.wordUpdate(chars, newLineWord);

    return { newLineWord, successKey: chars["keys"][0] };
  }

  updateNextRomaPattern(chars: CharsType, nextRomaPattern: string[]) {
    for (let i = 0; i < nextRomaPattern.length; i++) {
      if (chars["keys"][0] === nextRomaPattern[i][0]) {
        nextRomaPattern[i] = nextRomaPattern[i].slice(1);
        if (nextRomaPattern[i].length == 0) {
          nextRomaPattern.splice(i, 1);
          i--;
        }
      } else {
        nextRomaPattern.splice(i, 1);
        i--;
      }
    }

    return nextRomaPattern;
  }

  kanaFilter(kana: string, char: string, romaPattern: string[], newLineWord: WordType) {
    if (kana.length >= 2 && romaPattern.length) {
      const IS_SOKUON_YOUON =
        (kana[0] != "っ" && (romaPattern[0][0] == "x" || romaPattern[0][0] == "l")) ||
        (kana[0] == "っ" && (char == "u" || romaPattern[0][0] == char));

      if (IS_SOKUON_YOUON) {
        //促音・拗音のみを入力した場合、かな表示を更新
        newLineWord.correct["k"] += newLineWord.nextChar["k"].slice(0, 1);
        newLineWord.nextChar["k"] = newLineWord.nextChar["k"].slice(1);
      }
    }

    return newLineWord;
  }

  // xnで「ん」を打鍵する場合、次の文字から[nn, n']の打鍵パターンを除外する
  nextNNFilter(char: string, newLineWord: WordType) {
    const NEXT_TO_NEXT_CHAR = newLineWord.word[0]["r"];
    const isXN =
      char == "x" &&
      NEXT_TO_NEXT_CHAR[0] &&
      NEXT_TO_NEXT_CHAR[0][0] != "n" &&
      NEXT_TO_NEXT_CHAR[0][0] != "N";

    if (isXN) {
      return NEXT_TO_NEXT_CHAR.filter((value: string) => {
        return value.match(/^(?!(n|')).*$/);
      });
    } else {
      return NEXT_TO_NEXT_CHAR;
    }
  }

  wordUpdate(chars: CharsType, newLineWord: WordType) {
    const kana = newLineWord.nextChar["k"];
    const romaPattern = newLineWord.nextChar["r"];
    // const POINT = newLineWord.nextChar["point"];

    //チャンク打ち切り
    if (!romaPattern.length) {
      newLineWord.correct["k"] += kana;
      //スコア加算
      this.updatePoint = newLineWord.nextChar["p"];
      newLineWord.nextChar = newLineWord.word.shift() || { k: "", r: [""], p: 0 };
    }

    newLineWord.correct["r"] += chars["keys"][0];

    return newLineWord;
  }
}

type DakuHandakuData = {
  type: "" | "゛" | "゜";
  normalized: "" | NormalizeHirakana;
  dakuHandaku: "" | Dakuten | HanDakuten;
};

class KanaInput {
  newLineWord: WordType;
  updatePoint: number;
  successKey: string;
  constructor({ chars, lineWord }: JudgeType) {
    this.updatePoint = 0;
    const result = this.hasKana({ chars, lineWord });
    this.newLineWord = result.newLineWord as WordType;
    this.successKey = result.successKey;
  }

  hasKana({ chars, lineWord }: JudgeType) {
    let newLineWord = { ...lineWord };

    const nextKana = lineWord.nextChar["k"];
    const keys = chars.keys;
    const isdakuHandaku = dakuHandakuList.includes(nextKana[0]);

    const dakuHanDakuData: DakuHandakuData = isdakuHandaku
      ? this.parseDakuHandaku(nextKana[0] as Dakuten | HanDakuten)
      : {
          type: "",
          normalized: "",
          dakuHandaku: "",
        };

    const successIndex: number = keys.indexOf(
      dakuHanDakuData.normalized ? dakuHanDakuData.normalized : nextKana[0].toLowerCase(),
    );

    const char =
      keys[successIndex] === "゛" || keys[successIndex] === "゜"
        ? newLineWord.kanaDakuten
        : keys[successIndex];

    if (!char) {
      return { newLineWord, successKey: "" };
    }

    if (dakuHanDakuData.type) {
      const yoon = nextKana.length >= 2 && dakuHanDakuData.type ? nextKana[1] : "";
      newLineWord.nextChar["k"] = dakuHanDakuData.type + yoon;
      newLineWord.kanaDakuten = dakuHanDakuData.dakuHandaku;
    } else {
      if (nextKana.length >= 2) {
        newLineWord.correct["k"] += char;
        newLineWord.nextChar["k"] = newLineWord.nextChar["k"].slice(1);
      } else {
        //チャンク打ち切り
        newLineWord = this.wordUpdate(char, newLineWord);
      }
    }

    return { newLineWord, successKey: char };
  }

  parseDakuHandaku(dakuHandaku: Dakuten | HanDakuten): {
    type: "" | "゛" | "゜";
    normalized: "" | NormalizeHirakana;
    dakuHandaku: "" | Dakuten | HanDakuten;
  } {
    const type: "" | "゛" | "゜" = dakuKanaList.includes(dakuHandaku) ? "゛" : "゜";
    const normalized: "" | NormalizeHirakana = dakuHandaku.normalize("NFD")[0] as NormalizeHirakana;
    return { type, normalized, dakuHandaku };
  }

  wordUpdate(char: string, newLineWord: WordType) {
    const romaPattern = newLineWord.nextChar["r"];

    newLineWord.correct["k"] += char;
    newLineWord.correct["r"] += romaPattern[0];

    //スコア加算
    this.updatePoint = newLineWord.nextChar["p"];
    newLineWord.nextChar = newLineWord.word.shift() || { k: "", r: [""], p: 0 };

    return newLineWord;
  }
}

const CODES = [
  "Space",
  "Digit1",
  "Digit2",
  "Digit3",
  "Digit4",
  "Digit5",
  "Digit6",
  "Digit7",
  "Digit8",
  "Digit9",
  "Digit0",
  "Minus",
  "Equal",
  "IntlYen",
  "BracketLeft",
  "BracketRight",
  "Semicolon",
  "Quote",
  "Backslash",
  "Backquote",
  "IntlBackslash",
  "Comma",
  "Period",
  "Slash",
  "IntlRo",
];
const TENKEYS = [
  "Numpad1",
  "Numpad2",
  "Numpad3",
  "Numpad4",
  "Numpad5",
  "Numpad6",
  "Numpad7",
  "Numpad8",
  "Numpad9",
  "Numpad0",
  "NumpadDivide",
  "NumpadMultiply",
  "NumpadSubtract",
  "NumpadAdd",
  "NumpadDecimal",
];

interface TypingEvent {
  event: KeyboardEvent;
  lineWord: WordType;
  inputMode?: InputModeType;
}

export class Typing {
  newLineWord: WordType;
  updatePoint: number;
  successKey: string;

  constructor({ event, lineWord, inputMode }: TypingEvent) {
    const chars: CharsType =
      inputMode === "roma" ? this.romaMakeInput(event) : this.kanaMakeInput(event);
    const inputResult =
      inputMode === "roma"
        ? new RomaInput({ chars, lineWord })
        : new KanaInput({ chars, lineWord });

    this.newLineWord = inputResult.newLineWord;
    this.updatePoint = inputResult.updatePoint;
    this.successKey = inputResult.successKey;
  }

  romaMakeInput(event: KeyboardEvent) {
    const input = {
      keys: [event.key.toLowerCase()],
      shift: event.shiftKey,
    };

    return input;
  }

  kanaMakeInput(event: KeyboardEvent) {
    const input = {
      keys: KANA_CODE_MAP[event.code] ? KANA_CODE_MAP[event.code] : KANA_KEY_MAP[event.key],
      shift: event.shiftKey,
    };

    if (event.shiftKey) {
      if (event.code == "KeyE") {
        input.keys[0] = "ぃ";
      }
      if (event.code == "KeyZ") {
        input.keys[0] = "っ";
      }

      //ATOK入力 https://support.justsystems.com/faq/1032/app/servlet/qadoc?QID=024273
      if (event.code == "KeyV") {
        input.keys.push("ゐ", "ヰ");
      }
      if (event.code == "Equal") {
        input.keys.push("ゑ", "ヱ");
      }
      if (event.code == "KeyT") {
        input.keys.push("ヵ");
      }
      if (event.code == "Quote") {
        input.keys.push("ヶ");
      }
      if (event.code == "KeyF") {
        input.keys.push("ゎ");
      }
      if (event.key == "0") {
        input.keys = ["を"];
      }
    }

    if (keyboardCharacters.includes(event.key)) {
      input.keys.push(
        event.key.toLowerCase(),
        event.key.toLowerCase().replace(event.key.toLowerCase(), function (s) {
          return String.fromCharCode(s.charCodeAt(0) + 0xfee0);
        }),
      );
    }

    return input;
  }
}

export class Success extends CalcTypeSpeed {
  newStatus: Status;

  constructor(
    status: Status,
    statusRef: React.RefObject<StatusRef>,
    playingComboRef: React.RefObject<PlayingComboRef>,
    inputMode: InputModeType,
    updatePoint: number,
    newLineWord: WordType,
    map: CreateMap,
    lineTime: number,
    remainTime: number,
    char: string,
  ) {
    super(status, lineTime, statusRef);

    this.newStatus = this.updateStatus(
      { ...status },
      statusRef,
      playingComboRef,
      inputMode,
      updatePoint,
      newLineWord,
      map,
      remainTime,
      lineTime,
    );

    statusRef.current!.lineStatus.typeResult.push({
      type: {
        char: char,
        isSuccess: true,
      },
      time: lineTime,
    });
  }

  updateStatus(
    newStatus: Status,
    statusRef: React.RefObject<StatusRef>,
    playingComboRef: React.RefObject<PlayingComboRef>,
    inputMode: InputModeType,
    updatePoint: number,
    newLineWord: WordType,
    map: CreateMap,
    remainTime: number,
    lineTime: number,
  ) {

    if(statusRef.current!.lineStatus.lineType === 0){
      statusRef.current!.lineStatus.latency = lineTime
    }
    newStatus.type++;
    statusRef.current!.lineStatus.lineType++;
    statusRef.current!.status.missCombo = 0;
    newStatus.point += updatePoint;
    newStatus.kpm = this.totalTypeSpeed;

    const newCombo = playingComboRef.current!.getCombo() + 1;

    playingComboRef.current?.setCombo(newCombo);

    if (newCombo > statusRef.current!.status.maxCombo) {
      statusRef.current!.status.maxCombo = newCombo;
    }

    if (inputMode === "roma") {
      statusRef.current!.status.romaType++;
    } else if (inputMode === "kana") {
      statusRef.current!.status.kanaType++;
    } else if (inputMode === "flick") {
      statusRef.current!.status.flickType++;
    }

    //ライン打ち切り
    if (!newLineWord.nextChar["k"]) {
      const timeBonus = Math.round(remainTime * 1 * 100);
      newStatus.timeBonus = timeBonus; //speed;
      statusRef.current!.lineStatus.lineClearTime = lineTime;
      newStatus.score += newStatus.point + timeBonus;
      statusRef.current!.status.completeCount++;
      newStatus.line =
        map.lineLength -
        (statusRef.current!.status.completeCount + statusRef.current!.status.failureCount);
    }

    return newStatus;
  }
}

export class Miss {
  newStatus: Status;

  constructor(
    status: Status,
    statusRef: React.RefObject<StatusRef>,
    playingComboRef: React.RefObject<PlayingComboRef>,
    lineTime: number,
    char: string,
  ) {
    this.newStatus = this.missCounter({ ...status }, statusRef, playingComboRef);

    statusRef.current!.lineStatus.typeResult.push({
      type: {
        char: char,
        isSuccess: false,
      },
      time: lineTime,
    });
  }

  missCounter(
    newStatus: Status,
    statusRef: React.RefObject<StatusRef>,
    playingComboRef: React.RefObject<PlayingComboRef>,
  ) {
    newStatus.miss++;
    statusRef.current!.lineStatus.lineMiss++;
    statusRef.current!.status.missCombo++;
    playingComboRef.current?.setCombo(0);
    newStatus.point -= 5;
    return newStatus;
  }
}

export function isTyped({ event, lineWord }: TypingEvent) {
  const KEY_CODE = event.keyCode;
  const CODE = event.code;

  // isTyped
  const IS_TYPE =
    (KEY_CODE >= 65 && KEY_CODE <= 90) || CODES.includes(CODE) || TENKEYS.includes(CODE);
  //event.keyが"Process"になるブラウザの不具合が昔はあったので場合によっては追加する
  //ChatGPT「'Process' キーは通常、国際的なキーボードで入力方法やプロセスのキーを指すために使用されます。」

  const ACTIVE_ELEMENT = document.activeElement as HTMLInputElement;
  const HAS_FOCUS = ACTIVE_ELEMENT && ACTIVE_ELEMENT.type != "text";
  const KANA = lineWord.nextChar["k"];

  return IS_TYPE && HAS_FOCUS && KANA;
}

export function shortcutKey(
  event: KeyboardEvent,
  skipGuideRef: React.RefObject<SkipGuideRef>,
  playingRef: React.RefObject<PlayingRef>,
) {
  //間奏スキップ
  const skip = skipGuideRef.current?.getSkipGuide?.();

  switch (event.code) {
    case "Escape": //Escでポーズ
      playingRef.current!.gamePause();
      event.preventDefault();
      break;
    case "ArrowDown":
      event.preventDefault();

      break;

    case skip:
      playingRef.current!.pressSkip();
      event.preventDefault();

      break;

    case "F4":
      playingRef.current!.retry();
      event.preventDefault();

      break;

    case "F10":
      playingRef.current!.realtimeSpeedChange();
      break;
  }
}
