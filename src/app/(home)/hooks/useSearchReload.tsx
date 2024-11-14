import { useRouter } from "next/navigation";
import { useSearchMapKeyWordsAtom } from "../atoms/atoms";

export const useSearchReload = () => {
  const searchKeywords = useSearchMapKeyWordsAtom();

  const router = useRouter();

  return () => {
    router.push(`/?map-keyword=${searchKeywords}`);
  };
};
