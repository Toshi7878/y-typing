import { Text } from "@chakra-ui/react";
import { memo } from "react";

interface PointStatusValueProps {
  value: number;
  timeBonusValue: number;
}
const PointStatusValue = ({ value, timeBonusValue }: PointStatusValueProps) => {
  return (
    <>
      <Text as="span" fontSize="4xl" className="value">
        {value.toString()}
        <small>{timeBonusValue > 0 && `+${timeBonusValue.toString()}`}</small>
      </Text>
    </>
  );
};

export default memo(PointStatusValue);
