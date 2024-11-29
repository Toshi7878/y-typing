import { CreateMap } from "@/app/type/ts/scene-ts/ready/createTypingWord";
import { useLyricsAtom, useMapAtom } from "@/app/type/type-atoms/gameRenderAtoms";
import { useRefs } from "@/app/type/type-contexts/refsProvider";
import { Box } from "@chakra-ui/react";

const PlayingLyrics = () => {
  const { statusRef } = useRefs();
  const lyrics = useLyricsAtom();
  const map = useMapAtom() as CreateMap;

  const count = statusRef.current?.status.count as number;
  const isChangeCSS = map.mapData[count].options?.isChangeCSS;
  const changeCSS = map.mapData[count].options?.changeCSS || "";
  return (
    <>
      <Box
        isTruncated
        fontWeight="bold"
        fontSize="2.75rem"
        id="lyrics"
        ml={-8}
        className={"-inset-5 lyrics-font"}
        dangerouslySetInnerHTML={{
          __html: `<ruby class="invisible">あ<rt>あ<rt></ruby>${lyrics}`,
        }}
      />

      <style>{isChangeCSS ? changeCSS : ""}</style>
    </>
  );
};
PlayingLyrics.displayName = "PlayingLyrics";

export default PlayingLyrics;
