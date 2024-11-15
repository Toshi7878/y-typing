import React, { useEffect, useState } from "react";
import { Box, Spinner } from "@chakra-ui/react"; // Boxコンポーネントを追加
import { useSession } from "next-auth/react";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import { RankingListType } from "@/app/type/ts/type";
import RankingTr from "./RankingTr";
import RankingMenu from "./RankingMenu";
import { useSceneAtom, useSetRankingScoresAtom } from "@/app/type/type-atoms/gameRenderAtoms";
import { useRankingQuery } from "@/app/type/hooks/data-query/useRankingQuery";

const RankingList = () => {
  const { data: session } = useSession();
  const { bestScoreRef } = useRefs();
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const setRankingScores = useSetRankingScoresAtom();
  const scene = useSceneAtom();
  const { data, error, isLoading } = useRankingQuery();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showMenu !== null &&
        !event
          .composedPath()
          .some(
            (el) =>
              (el as HTMLElement).className?.includes("cursor-pointer") ||
              (el as HTMLElement).tagName === "BUTTON" ||
              (el as HTMLElement).tagName === "A",
          )
      ) {
        setShowMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  useEffect(() => {
    return () => {
      setShowMenu(null);
      setHoveredIndex(null);
    };
  }, []);

  useEffect(() => {
    const scores = data ? data.map((result: RankingListType) => result.score) : [];

    setRankingScores(scores);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    const userId = Number(session?.user?.id);

    if (scene === "playing" && data) {
      for (let i = 0; i < data.length; i++) {
        if (userId === Number(data[i].userId)) {
          bestScoreRef.current = data[i].score;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, data]);

  if (isLoading)
    return (
      <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
        <Spinner size="xl" />
      </Box>
    );
  if (error) return <div>Error loading data</div>;

  return (
    <>
      {data &&
        data.map((user: RankingListType, index: number) => {
          const romaType = user.romaType;
          const kanaType = user.kanaType;
          const flickType = user.flickType;
          const type = romaType + kanaType + flickType;
          const handleShowMenu = () => {
            if (showMenu === index) {
              setShowMenu(null);
            } else {
              setShowMenu(index);
            }
          };

          return (
            <React.Fragment key={index}>
              <RankingTr
                sessionUserId={Number(session?.user?.id)}
                rankingUserId={Number(user.userId)}
                rank={index + 1}
                name={user.user.name}
                score={user.score}
                type={type}
                kpm={user.kpm}
                rkpm={user.rkpm}
                romaKpm={user.romaKpm}
                defaultSpeed={user.defaultSpeed}
                romaType={romaType}
                kanaType={kanaType}
                flickType={flickType}
                miss={user.miss}
                lost={user.lost}
                maxCombo={user.maxCombo}
                clearRate={user.clearRate}
                updatedAt={user.updatedAt}
                isHighlighted={showMenu === index}
                isHovered={hoveredIndex === index}
                handleShowMenu={handleShowMenu}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {showMenu === index && (
                <RankingMenu
                  resultId={Number(user.id)}
                  userId={user.userId}
                  name={user.user.name}
                  setShowMenu={setShowMenu}
                  setHoveredIndex={setHoveredIndex}
                />
              )}
            </React.Fragment>
          );
        })}
    </>
  );
};

RankingList.displayName = "RankingList";

export default RankingList;
