import { atom, useAtomValue, useSetAtom } from "jotai";
import { EditTabIndex } from "../ts/type";
import { YouTubeSpeed } from "@/types";
import { getEditAtomStore } from "../components/EditProvider";

const editTabIndexAtom = atom<EditTabIndex>(0);
const editAtomStore = getEditAtomStore();

export const useTabIndexAtom = () => {
  return useAtomValue(editTabIndexAtom, { store: editAtomStore });
};

export const useSetTabIndexAtom = () => {
  return useSetAtom(editTabIndexAtom, { store: editAtomStore });
};

export const editSpeedAtom = atom<YouTubeSpeed>(1);

export const isEditYouTubeReadyAtom = atom<boolean>(false);
export const isEditYouTubeStartedAtom = atom<boolean>(false);
export const isEditYouTubePlayingAtom = atom<boolean>(false);

export const editMapTitleAtom = atom<string>("");
export const editVideoIdAtom = atom<string>("");
export const editCreatorCommentAtom = atom<string>("");

export const editLineLyricsAtom = atom<string>("");
export const editLineWordAtom = atom<string>("");
export const editLineTimeAtom = atom<number | null>(null);
export const editLineSelectedNumberAtom = atom<number | null>(null);
export const editTimeCountAtom = atom<number>(0);

export const editAddLyricsTextBoxAtom = atom<string>("");
export const editTimeRangeValue = atom<number>(0);
