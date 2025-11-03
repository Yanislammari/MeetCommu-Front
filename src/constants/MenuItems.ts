import { FiHome, FiMessageSquare, FiSettings, FiUser, FiUsers } from "react-icons/fi";
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
  },
  {
    icon: FiHome,
    name: "Home",
    path: "/home",
    type: MenuItemType.SIDEBAR
  },
  {
    icon: FiMessageSquare,
    name: "Messages",
    path: "/messages",
    type: MenuItemType.SIDEBAR
  },
  {
    icon: FiUsers,
    name: "Communities",
    path: "/communities",
    type: MenuItemType.SIDEBAR
  },
  {
    icon: FiSettings,
    name: "Settings",
    path: "/settings",
    type: MenuItemType.SIDEBAR
  }
];
