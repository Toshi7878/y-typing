import HeaderContent from "./HeaderContent";
import HeaderClientProvider from "./HeaderClientProvider";
import { getNewNotificationCheck } from "@/lib/server-fetcher/getNewNotificationCheck";
import { Session } from "next-auth";

// export const runtime = "edge";

interface HeaderProps {
  session: Session | null;
}

const Header = async ({ session }: HeaderProps) => {
  const isNewNotification = session?.user.name ? await getNewNotificationCheck() : false;
  return (
    <HeaderClientProvider>
      <HeaderContent isNewNotification={isNewNotification} />
    </HeaderClientProvider>
  );
};

export default Header;
