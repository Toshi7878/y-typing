import { useSetEditTimeCountAtom } from "../edit-atom/editAtom";
import { useRefs } from "../edit-contexts/refsProvider";

export const useUpdateCurrentLine = () => {
  const { tbodyRef } = useRefs();
  const setTimeCount = useSetEditTimeCountAtom();

  return (newCount: number) => {
    setTimeCount(newCount);
    const tbodyChildren = tbodyRef.current?.children;
    if (tbodyChildren) {
      for (let i = 0; i < tbodyChildren.length; i++) {
        const trElement = tbodyChildren[i] as HTMLElement;
        if (trElement.getAttribute("data-line-index") === String(newCount)) {
          trElement.classList.add("current-time-line");
        } else {
          trElement.classList.remove("current-time-line");
        }
      }
    }
  };
};
