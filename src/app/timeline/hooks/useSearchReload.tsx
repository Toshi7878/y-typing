import { useRouter } from "next/navigation";
import {
  useSearchResultClearRateAtom,
  useSearchResultKeyWordsAtom,
  useSearchResultKpmAtom,
  useSearchResultModeAtom,
  useSearchResultSpeedAtom,
} from "../atoms/atoms";

export const useSearchReload = (refetch: () => void) => {
  const searchKeywords = useSearchResultKeyWordsAtom();

  const searchKpm = useSearchResultKpmAtom();
  const searchClearRate = useSearchResultClearRateAtom();
  const searchSpeed = useSearchResultSpeedAtom();
  const searchMode = useSearchResultModeAtom();
  const router = useRouter();
  return () => {
    router.push(`/timeline?mode=${searchMode}&user-keyword=${searchKeywords.userName}`);
    refetch();
  };
};
