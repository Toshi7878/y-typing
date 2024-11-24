import SkeletonThumbnail from "./child/SkeletonThumbnail";
import SkeletonRightInfo from "./child/SkeletonRightInfo";
import MapCard from "./MapCard";

function SkeletonCard() {
  return (
    <MapCard>
      <SkeletonThumbnail />
      <SkeletonRightInfo />
    </MapCard>
  );
}

export default SkeletonCard;
