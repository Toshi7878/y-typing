import { memo } from "react";

interface PointStatusValueProps {
  value: number;
  timeBonusValue: number;
}
const PointStatusValue = ({ value, timeBonusValue }: PointStatusValueProps) => {
  return (
    <>
      <span className="value">
        {value.toString()}
        {timeBonusValue > 0 && `+${timeBonusValue.toString()}`}
      </span>
    </>
  );
};

export default memo(PointStatusValue);
