import { HOME_THUBNAIL_HEIGHT, HOME_THUBNAIL_WIDTH } from "@/app/(home)/ts/const/consts";
import MapCard from "./MapCard";
import MapLeftThumbnail from "./child/MapCardLeftThumbnail";
import MapCardRightInfo from "./child/MapCardRightInfo";

function SkeletonCard() {
  return (
    <MapCard>
      <MapLeftThumbnail thumnailWidth={HOME_THUBNAIL_WIDTH} thumnailHeight={HOME_THUBNAIL_HEIGHT} />
      <MapCardRightInfo>
        <></>
      </MapCardRightInfo>
    </MapCard>
  );
}

export default SkeletonCard;
