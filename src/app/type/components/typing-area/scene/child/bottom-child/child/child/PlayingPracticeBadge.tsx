import { UseDisclosureReturn } from "@chakra-ui/react";
import { useSceneAtom, useUserOptionsAtom } from "@/app/type/type-atoms/gameRenderAtoms";
import { useToggleLineList } from "@/app/type/hooks/playing-hooks/useToggleLineList";
import { useMoveLine } from "@/app/type/hooks/playing-hooks/useMoveLine";
import PlayingLineSeekBadge from "./child/PlayingLineSeekBadge";
import PlayingBottomBadge from "./child/PlayingBottomBadge";

interface PlayingPracticeBadgeProps {
  drawerClosure: UseDisclosureReturn;
}

const PlayingPracticeBadge = function ({ drawerClosure }: PlayingPracticeBadgeProps) {
  const scene = useSceneAtom();
  const toggleLineListDrawer = useToggleLineList();
  const { movePrevLine, moveNextLine } = useMoveLine();
  const userOptionsAtom = useUserOptionsAtom();

  return (
    <>
      {scene !== "playing" && (
        <>
          <PlayingLineSeekBadge
            badgeText="ライン移動"
            kbdTextPrev="←"
            kbdTextNext="→"
            onClick={() => {}}
            onClickPrev={() => movePrevLine(drawerClosure)}
            onClickNext={() => moveNextLine(drawerClosure)}
          />
          <PlayingBottomBadge
            badgeText="ライン一覧"
            kbdText={userOptionsAtom.toggleInputModeKey === "tab" ? "F1" : "Tab"}
            onClick={() => toggleLineListDrawer(drawerClosure)}
            isPauseDisabled={false}
            isKbdHidden={false}
          />
        </>
      )}
    </>
  );
};

export default PlayingPracticeBadge;
