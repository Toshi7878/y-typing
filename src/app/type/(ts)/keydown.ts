import { SetStateAction } from "jotai";
import { Word } from "../components/(typing-area)/scene/child/PlayingCenter";
import { Status } from "../(atoms)/type";

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
  key: string[];
  shift: boolean;
}

interface JudgeType {
  chars: CharsType;
  lineWord: Word;
}
class Judge {
  newLineWord: Word | false;
  updatePoint: number;
  constructor({ chars, lineWord }: JudgeType) {
    this.updatePoint = 0;
    this.newLineWord = this.hasRomaPattern(chars, lineWord);
  }
  hasRomaPattern(chars: CharsType, lineWord: Word) {
    let newLineWord = { ...lineWord };
    const nextRomaPattern: string[] = newLineWord.nextChar["r"];
    const kana = lineWord.nextChar["k"];
    const IS_SUCCESS = nextRomaPattern.some(
      (pattern) => pattern[0].toLowerCase() === chars["key"][0],
    );

    if (!IS_SUCCESS) {
      return false;
    }

    if (kana == "ん" && newLineWord.word[0]) {
      newLineWord.word[0]["r"] = this.nextNNFilter(chars["key"][0], newLineWord);
    }

    newLineWord.nextChar["r"] = this.updateNextRomaPattern(chars, nextRomaPattern);
    newLineWord = this.kanaFilter(kana, chars["key"][0], nextRomaPattern, newLineWord);

    newLineWord = this.wordUpdate(chars, newLineWord);

    return newLineWord;
  }

  updateNextRomaPattern(chars: CharsType, nextRomaPattern: string[]) {
    for (let i = 0; i < nextRomaPattern.length; i++) {
      if (chars["key"][0] === nextRomaPattern[i][0]) {
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

  kanaFilter(kana: string, char: string, romaPattern: string[], newLineWord: Word) {
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
  nextNNFilter(char: string, newLineWord: Word) {
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

  wordUpdate(chars: CharsType, newLineWord: Word) {
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

    newLineWord.correct["r"] += chars["key"][0];

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
  lineWord: Word;
}

export class Typing {
  newLineWord: Word | false;
  updatePoint: number;
  constructor({ event, lineWord }: TypingEvent) {
    const chars: CharsType = this.makeInput(event);
    const judgeResult = new Judge({ chars, lineWord });

    this.newLineWord = judgeResult.newLineWord;
    this.updatePoint = judgeResult.updatePoint;
  }

  makeInput(event: KeyboardEvent) {
    const Input = {
      key: [event.key.toLowerCase()],
      shift: event.shiftKey,
    };

    return Input;
  }
}

export class Success {
  newStatus: Status;

  constructor(status: Status, updatePoint: number, newLineWord: Word) {
    //  const NEXT_POINT = 10 * newLineWord.nextChar["r"][0].length;
    // if (NEXT_POINT == 0) {
    //   // Type.completed();
    // }
    this.newStatus = this.typeCounter({ ...status }, updatePoint, newLineWord);
    // const KANA_MODE = game.inputMode != "roma";
    // this.char.key = this.char.key[0];
    // lineResult.value.typingResult.push({
    //   char: this.char,
    //   result: true,
    //   time: timer.currentTime,
    //   kanaMode: KANA_MODE,
    // });
  }

  typeCounter(newStatus: Status, updatePoint: number, newLineWord: Word) {
    newStatus.typeCount++;
    newStatus.comboCount++;
    newStatus.missComboCount = 0;
    newStatus.point += updatePoint;

    //ライン打ち切り
    if (!newLineWord.nextChar["k"]) {
      newStatus.lineCompleteCount++;
    }

    return newStatus;
  }
}

export class Miss {
  newStatus: Status;

  constructor(status: Status) {
    this.newStatus = this.missCounter({ ...status });

    // const KANA_MODE = game.inputMode != "roma";
    // this.char.key = this.char.key[0];
    // lineResult.value.typingResult.push({
    //   char: this.char,
    //   result: false,
    //   time: timer.currentTime,
    //   kanaMode: KANA_MODE,
    // });
  }

  missCounter(newStatus: Status) {
    newStatus.missCount++;
    newStatus.missComboCount++;
    newStatus.comboCount = 0;

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
