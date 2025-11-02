import type React from "react";
import type { MenuItem } from "../models/MenuItem";
import { useNavigate, type NavigateFunction } from "react-router";

interface UserDropdownItemProps {
  menuItem: MenuItem;
}

const UserDropdownItem: React.FC<UserDropdownItemProps> = (props: UserDropdownItemProps) => {
  const navigate: NavigateFunction = useNavigate();

  return (
    <div key={props.menuItem.name}>
      {props.menuItem.last && <div className="border-t border-white/10 my-1" />}
      <button onClick={() => navigate(props.menuItem.path)} className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left transition-colors duration-150 cursor-pointer ${ props.menuItem.last ? "text-red-400 hover:bg-[#2a2a3d]" : "text-gray-200 hover:bg-[#2a2a3d]" }`}>
        <props.menuItem.icon />
        <p>{props.menuItem.name}</p>
      </button>
    </div>
  );
}

export default UserDropdownItem;
