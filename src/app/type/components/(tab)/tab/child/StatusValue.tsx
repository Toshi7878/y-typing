import { memo } from "react";

const StatusValue = ({ value }: { value: number | string }) => {
  return <span className="value">{value}</span>;
};

export default memo(StatusValue);
