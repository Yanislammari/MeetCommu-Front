import type React from "react";
import type { MenuItem } from "../models/MenuItem";
import logo from "/logo.png";
import MenuItemType from "../models/MenuItemType";
import SidebarItem from "./SidebarItem";
import type { User } from "../models/User";
import { FiLogOut } from "react-icons/fi";
import UserAvatar from "./UserAvatar";
import Size from "../models/Size";
import { useLocation, useNavigate, type Location, type NavigateFunction } from "react-router";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";

interface SidebarProps {
  menuItems: MenuItem[];
  userConnected: User | null;
}

const Sidebar: React.FC<SidebarProps> = (props: SidebarProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigate: NavigateFunction = useNavigate();
  const location: Location = useLocation();
  const { logout } = useAuth();

  const onConfirmLogout = (): void => {
    logout();
    setShowModal(false);
    navigate("/");
  }

  return (
    <aside className="w-20 md:w-64 bg-[#161625] border-r border-white/10 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-center md:justify-start gap-2 p-4 border-b border-white/10">
          <div className="rounded-lg p-2">
            <img src={logo} className="w-8 h-8"></img>
          </div>
          <h1 className="hidden md:block text-xl font-semibold">Commumeet</h1>
        </div>
        <nav className="flex flex-col p-4 gap-4 mt-4">
        {props.menuItems.filter((item) => item.type === MenuItemType.SIDEBAR).map((item) => (
          <SidebarItem icon={<item.icon />} label={item.name} path={item.path} active={location.pathname === item.path ? true : false} />
        ))}
        </nav>
      </div>
      <div className="p-4 border-t border-white/10 flex flex-col items-center md:items-start gap-3">
        {props.userConnected && (
          <div className="flex items-center gap-3">
            <UserAvatar onClick={() => navigate("/profile")} user={props.userConnected} size={Size.MD} />
            <div className="hidden md:block">
              <p className="text-sm font-semibold">{props.userConnected.username}</p>
              <p className="text-xs opacity-70">{props.userConnected.email}</p>
            </div>
          </div>
        )}
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 text-sm mt-2 opacity-70 hover:opacity-100 transition cursor-pointer">
          <FiLogOut />
          <p><span className="hidden md:block">Logout</span></p>
        </button>
      </div>
      <LogoutConfirmationModal isOpen={showModal} onCancel={() => setShowModal(false)} onConfirm={onConfirmLogout} />
    </aside>
  );
}

export default Sidebar;
