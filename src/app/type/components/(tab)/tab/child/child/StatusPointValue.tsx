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
        <small>{timeBonusValue > 0 && `+${timeBonusValue.toString()}`}</small>
      </span>
    </>
  );
};

export default memo(PointStatusValue);
