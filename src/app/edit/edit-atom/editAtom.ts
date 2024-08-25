import { atom } from "jotai";
import { EditTabIndex } from "../ts/type";
import { YouTubeSpeed } from "@/types";

export const editTabIndexAtom = atom<EditTabIndex>(0);

export const editSpeedAtom = atom<YouTubeSpeed>(1);
