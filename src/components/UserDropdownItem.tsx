import type React from "react";
import { useNavigate, type NavigateFunction } from "react-router";

interface UserDropdownItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const UserDropdownItem: React.FC<UserDropdownItemProps> = (props: UserDropdownItemProps) => {
  const navigate: NavigateFunction = useNavigate();

  return (
    <div key={props.label}>
      <button onClick={() => navigate(props.path)} className={"flex items-center gap-2 px-4 py-2 text-sm w-full text-left transition-colors duration-150 cursor-pointer text-gray-200 hover:bg-[#2a2a3d]"}>
        {props.icon}
        <p>{props.label}</p>
      </button>
    </div>
  );
}

export default UserDropdownItem;
