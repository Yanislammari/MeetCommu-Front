import type React from "react";
import { FiSearch } from "react-icons/fi";
import type { User } from "../models/User";
import { useState } from "react";
import UserAvatar from "./UserAvatar";
import Size from "../models/Size";
import UserDropdown from "./UserDropdown";
import { MENU_ITEMS } from "../constants/MenuItems";

interface NavbarProps {
  userConnected: User | null;
}

const Navbar: React.FC<NavbarProps> = (props: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10 bg-[#161625]/60 backdrop-blur-xl relative gap-2">
      <div className="w-full max-w-lg relative">
        <input type="text" placeholder="Search communities, users, games, articles..." className="w-full bg-[#1e1e2f] border border-white/10 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-[#9b8af7] focus:outline-none text-sm text-gray-200 placeholder-gray-500" />
        <FiSearch className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
      </div>
      <div className="flex items-center gap-2 text-gray-200 cursor-pointer select-none relative" onClick={() => props.userConnected && setIsMenuOpen(!isMenuOpen)}>
        <div className="hidden md:flex flex-col items-end mr-2">
          <p className="font-semibold text-sm">{props.userConnected ? props.userConnected.firstName : "Invité"}</p>
          <p className="text-xs text-gray-400">{props.userConnected ? `@${props.userConnected.username}` : "-"}</p>
        </div>
        <UserAvatar userConnected={props.userConnected} size={Size.MD} />
        {props.userConnected && isMenuOpen && (
          <UserDropdown menuItems={MENU_ITEMS} />
        )}
      </div>
    </header>
  );
}

export default Navbar;
