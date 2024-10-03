import { useCanUploadAtom } from "@/app/edit/edit-atom/editAtom";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";

export const useLinkClick = () => {
  const router = useRouter();

  const canUpload = useCanUploadAtom();

  return (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation(); // バブリングを防ぐ

    const currentPath = window.location.pathname;

    if (currentPath.includes("/edit") && canUpload) {
      const confirmUpload = window.confirm(
        "このページを離れると、行った変更が保存されない可能性があります。",
      );
      if (!confirmUpload) {
        return;
      }
    }

    NProgress.configure({ showSpinner: false });
    NProgress.configure({ trickle: false });

    NProgress.start();
    const href = event.currentTarget.getAttribute("href") || "";
    router.push(href);
  };
};
