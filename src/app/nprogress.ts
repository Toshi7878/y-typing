import { useRouter } from "next/navigation";
import NProgress from "nprogress";

export const useLinkClick = () => {
  const router = useRouter();

  return (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation(); // バブリングを防ぐ

    NProgress.configure({ showSpinner: false });
    NProgress.configure({ trickle: false });

    NProgress.start();
    const href = event.currentTarget.getAttribute("href") || "";
    router.push(href);
  };
};
