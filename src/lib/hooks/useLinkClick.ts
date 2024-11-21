import { useCanUploadAtom } from "@/app/edit/edit-atom/editAtom";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";

export const useLinkClick = () => {
  const router = useRouter();

  const canUpload = useCanUploadAtom();

  return (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.ctrlKey || event.altKey) {
      return;
    }
    event.preventDefault();
    event.stopPropagation(); // バブリングを防ぐ

    const currentPath = window.location.pathname;
    const href = event.currentTarget.getAttribute("href") || "";

    if (currentPath.includes("/edit") && canUpload) {
      const confirmUpload = window.confirm(
        "このページを離れると、行った変更が保存されない可能性があります。",
      );
      if (!confirmUpload) {
        return;
      }
    } else if (currentPath === href) {
      window.location.reload();
      return;
    }

    NProgress.configure({ showSpinner: false });
    NProgress.configure({ trickle: false });

    NProgress.start();
    router.push(href);
  };
};
