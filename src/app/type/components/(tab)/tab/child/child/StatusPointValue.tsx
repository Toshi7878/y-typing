import { memo } from "react";

interface PointStatusValueProps {
  value: number;
  timeBonusValue: number;
}
const PointStatusValue = ({ value, timeBonusValue }: PointStatusValueProps) => {
  return (
    <>
      <span className="value">{value}</span>

      {timeBonusValue > 0 && <span>+{timeBonusValue}</span>}
    </>
  );
};

export default memo(PointStatusValue);
