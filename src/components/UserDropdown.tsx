import type React from "react";
import type { MenuItem } from "../models/MenuItem";
import { motion } from "framer-motion";
import MenuItemType from "../models/MenuItemType";
import UserDropdownItem from "./UserDropdownItem";
import { FiLogOut } from "react-icons/fi";

interface UserDropdownProps {
  menuItems: MenuItem[];
  onLogoutClick: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = (props: UserDropdownProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }}  animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} onClick={(e) => e.stopPropagation()} className="absolute right-0 top-14 w-48 bg-[#1e1e2f] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
      {props.menuItems.filter((item) => item.type === MenuItemType.USER_DROPDOWN).map((item) => (
        <UserDropdownItem icon={<item.icon />} label={item.name} path={item.path} />
      ))}
      <div className="border-t border-white/10 my-1" />
      <button onClick={props.onLogoutClick} className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left transition-colors duration-150 cursor-pointer text-red-400 hover:bg-[#2a2a3d]">
        <FiLogOut />
        <p>Logout</p>
      </button>
    </motion.div>
  );
}

export default UserDropdown;
