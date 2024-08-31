import { Text } from "@chakra-ui/react";
import { memo } from "react";

const StatusValue = ({ value }: { value: number | string }) => {
  return (
    <Text as="span" fontSize="4xl" className="value">
      {value}
    </Text>
  );
};

export default memo(StatusValue);
