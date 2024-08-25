import { atom } from "jotai";
import { EditTabIndex } from "../ts/type";
import { YouTubeSpeed } from "@/types";

export const editTabIndexAtom = atom<EditTabIndex>(0);

export const editSpeedAtom = atom<YouTubeSpeed>(1);

export const isEditYouTubeReadyAtom = atom<boolean>(false);
export const isEditYouTubeStartedAtom = atom<boolean>(false);
export const isEditYouTubePlayingAtom = atom<boolean>(false);

export const editMapTitleAtom = atom<string>("");
export const editVideoIdAtom = atom<string>("");
export const editCreatorCommentAtom = atom<string>("");

export const editLineTimeAtom = atom<number | null>(null);
export const editLineLyricsAtom = atom<string>("");
export const editLineWordAtom = atom<string>("");
export const editLineSelectedNumberAtom = atom<number | null>(null);
