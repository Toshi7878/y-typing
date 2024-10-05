import { HeaderMenu, LeftNavConfig } from "@/types";

export const leftNavConfig: LeftNavConfig = {
  items: [
    {
      title: "Menu",
      menuItem: [
        { title: "更新履歴", href: "/changelog" },
        { title: "タイムライン", href: "/timeline" },
      ],
    },
  ],
};

export const loginMenuItem: HeaderMenu[] = [
  { title: "TestMenu1", href: "/" },
  { title: "TestMenu2", href: "/" },
];
