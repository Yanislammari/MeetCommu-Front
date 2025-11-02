import type { IconType } from "react-icons";
import type MenuItemType from "./MenuItemType";

export interface MenuItem {
  icon: IconType;
  name: string;
  path: string;
  type: MenuItemType;
  last?: boolean;
}
