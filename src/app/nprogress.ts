import NProgress from "nprogress";

export const handleLinkClick =
  (href: string, router: any) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation(); // バブリングを防ぐ

    NProgress.configure({ showSpinner: false });
    NProgress.configure({ trickle: false });

    NProgress.start();
    router.push(href);
  };
