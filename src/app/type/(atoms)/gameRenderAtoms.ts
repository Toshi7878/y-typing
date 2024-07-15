import { atom } from "jotai";
import { CreateMap } from "../(ts)/createTypingWord";
import { Speed, Status } from "../(ts)/type";

export const mapAtom = atom<CreateMap | null>(null);

export const sceneAtom = atom<"ready" | "playing" | "end">("ready");
export const tabIndexAtom = atom<0 | 1>(1);


export const playingNotifyAtom = atom<{ text: string }>({ text: "" });
export const mapIdAtom = atom<number>(0);

export const speedAtom = atom<Speed>({
  playSpeed: 1,
  realtimeSpeed: 1,
});
