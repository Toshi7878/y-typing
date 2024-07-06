import React, { forwardRef } from "react";

import { Card, CardBody } from "@chakra-ui/react"; // Card, CardBodyを追加

import "../../../style/statusTable.scss";

const TabRanking = forwardRef((props, ref) => {
  return (
    <Card variant={"filled"} bg="blue.100">
      <CardBody className="text-3xl font-bold">{`(* ' ｰ ' ) < ランキングはじゅんびちゅう`}</CardBody>
    </Card>
  );
});

TabRanking.displayName = "TabRanking";

export default TabRanking;
