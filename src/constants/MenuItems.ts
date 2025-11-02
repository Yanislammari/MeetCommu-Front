import { FiSettings, FiUser } from "react-icons/fi";
import MenuItemType from "../models/MenuItemType";
import type { MenuItem } from "../models/MenuItem";

export const MENU_ITEMS: MenuItem[] = [
  {
    icon: FiUser,
    name: "Profile",
    path: "/profile",
    type: MenuItemType.USER_DROPDOWN
  },
  {
    icon: FiSettings,
    name: "Settings",
    path: "/settings",
    type: MenuItemType.USER_DROPDOWN
  }
];
