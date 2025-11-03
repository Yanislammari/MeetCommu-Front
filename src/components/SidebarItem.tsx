import type React from "react";
import { useNavigate, type NavigateFunction } from "react-router";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = (props: SidebarItemProps) => {
  const navigate: NavigateFunction = useNavigate();

  return (
    <button onClick={() => navigate(props.path)} className={`flex items-center gap-4 px-3 py-2 rounded-lg cursor-pointer transition-all ${ props.active ? "bg-[#9b8af7]/20 text-[#9b8af7]" : "hover:bg-white/10 text-gray-300" }`}>
      <span className="text-xl">{props.icon}</span>
      <span className="hidden md:block text-sm font-medium">{props.label}</span>
    </button>
  );
}

export default SidebarItem;
