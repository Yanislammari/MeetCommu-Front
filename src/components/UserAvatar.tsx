import type React from "react";
import type { User } from "../models/User";
import placeholder from "./../assets/placeholder.png";
import type Size from "../models/Size";

interface UserAvatarProps {
  user: User | null;
  size?: Size;
  onClick?: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = (props: UserAvatarProps) => {
  const getInitials = (): string => {
    if (!props.user) {
      return "??";
    }

    const first: string = props.user.firstName?.charAt(0).toUpperCase() || "";
    const last: string = props.user.lastName?.charAt(0).toUpperCase() || props.user.username?.charAt(0).toUpperCase() || "";
    return `${first}${last}`;
  }

  const getColorString = (str: string): string => {
    let hash: number = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue: number = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  }

  return (
    <div onClick={props.onClick} className={`${props.size} rounded-full flex-shrink-0 border border-white/10 hover:border-[#9b8af7] transition-all overflow-hidden flex items-center justify-center cursor-pointer`} style={{ backgroundColor: !props.user ? "transparent" : props.user.profilePictureUrl ? "transparent" : getColorString(props.user.username || "user") }}>
      {!props.user ? (
        <img alt="Profil placeholder" src={placeholder} className="w-full h-full object-cover opacity-90" />
      ) : props.user.profilePictureUrl ? (
        <img alt="Profil" src={props.user.profilePictureUrl!} className="w-full h-full object-cover" />
      ) : (
        <span className="font-semibold text-white select-none">{getInitials()}</span>
      )}
    </div>
  );
}

export default UserAvatar;
