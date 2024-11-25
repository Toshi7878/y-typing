import { MapCardInfo } from "@/app/(home)/ts/type";
import UpdateAtText from "@/components/custom-ui/UpdateAtText";
import UserLinkText from "@/components/custom-ui/UserLinkText";
import { Box, Text } from "@chakra-ui/react";
import React from "react";

interface MapCreateUserProps {
  map: MapCardInfo;
}

const MapCreateUser = (props: MapCreateUserProps) => {
  return (
    <Text as="small" mt={2}>
      <UserLinkText userId={props.map.user.id} userName={props.map.user.name} />
      <Text as="span" fontSize="xs" display={{ base: "none", sm: "inline-block" }}>
        <Box mx={1}>
          - <UpdateAtText updatedAt={props.map.updatedAt} />
        </Box>
      </Text>
    </Text>
  );
};

export default MapCreateUser;
