import { atom } from "jotai";
import { EditTabIndex } from "../ts/type";
import { YouTubeSpeed } from "@/types";

export const editTabIndexAtom = atom<EditTabIndex>(0);

export const editSpeedAtom = atom<YouTubeSpeed>(1);

export const isEditYouTubeReadyAtom = atom<boolean>(false);
export const isEditYouTubeStartedAtom = atom<boolean>(false);
export const isEditYouTubePlayingAtom = atom<boolean>(false);
