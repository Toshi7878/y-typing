import { QueryClient, QueryKey } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useLinkClick } from "../useLinkClick";

export const useInvalidateQueryLink = () => {
  const pathname = usePathname();
  const handleLinkClick = useLinkClick();

  return (
    event: React.MouseEvent<HTMLAnchorElement>,
    queryClient: QueryClient,
    queryKey: QueryKey,
  ) => {
    if (pathname === event.currentTarget.pathname) {
      //   queryClient.invalidateQueries({ queryKey: queryKey });
    } else {
      handleLinkClick(event);
    }
  };
};
