import { useStore } from "jotai";
import { CreateMap } from "../../ts/scene-ts/ready/createTypingWord";
import { lineSelectIndexAtom, useMapAtom } from "../../type-atoms/gameRenderAtoms";
import { useRefs } from "../../type-contexts/refsProvider";

export const usePracticeLineDrawerScroll = () => {
  const { cardRefs, modalContentRef, gameStateRef } = useRefs();
  const map = useMapAtom() as CreateMap;
  const typeAtomStore = useStore();

  const scrollToCard = (newIndex: number) => {
    const card = cardRefs.current![newIndex];

    if (modalContentRef.current && card) {
      const scrollHeight = modalContentRef.current.scrollHeight;
      modalContentRef.current.scrollTop =
        (scrollHeight * (newIndex - 2)) / map!.typingLineNumbers.length;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  return () => {
    const lineSelectIndex = typeAtomStore.get(lineSelectIndexAtom);
    if (lineSelectIndex && gameStateRef.current?.resultDrawerManualScroll === false) {
      scrollToCard(lineSelectIndex);
    }

    gameStateRef.current!.resultDrawerManualScroll = false;
  };
};
