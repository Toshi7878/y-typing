import { useRankingQuery } from "@/app/type/hooks/data-query/useRankingQuery";
import { RankingListType } from "@/app/type/ts/type";
import { useSceneAtom, useSetRankingScoresAtom } from "@/app/type/type-atoms/gameRenderAtoms";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import { Box, Spinner } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import RankingTable from "../RankingTable";
import RankingTr from "./child/RankingTr";

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

  if (isLoading) {
    return (
      <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
        <Spinner size="lg" />
      </Box>
    );
  }
  if (error) return <div>Error loading data</div>;

  if (!data) return null;

  return (
    <RankingTable>
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
            <RankingTr
              key={user.userId}
              result={user}
              index={index}
              rank={index + 1}
              type={type}
              romaType={romaType}
              kanaType={kanaType}
              flickType={flickType}
              isHighlighted={showMenu === index}
              isHovered={hoveredIndex === index}
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              setHoveredIndex={setHoveredIndex}
              handleShowMenu={handleShowMenu}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          );
        })}
    </RankingTable>
  );
};

export default RankingList;
