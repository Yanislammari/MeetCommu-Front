import type React from "react";
import type { User } from "../models/User";
import placeholder from "./../assets/placeholder.png";
import type Size from "../models/Size";

interface UserAvatarProps {
  userConnected: User | null;
  size?: Size;
}

const UserAvatar: React.FC<UserAvatarProps> = (props: UserAvatarProps) => {
  const getInitials = (): string => {
    if (!props.userConnected) {
      return "??";
    }

    const first: string = props.userConnected.firstName?.charAt(0).toUpperCase() || "";
    const last: string = props.userConnected.lastName?.charAt(0).toUpperCase() || props.userConnected.username?.charAt(0).toUpperCase() || "";
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
    <div className={`${props.size} rounded-full flex-shrink-0 border border-white/10 hover:border-[#9b8af7] transition-all overflow-hidden flex items-center justify-center`} style={{ backgroundColor: !props.userConnected ? "transparent" : props.userConnected.profilePictureUrl ? "transparent" : getColorString(props.userConnected.username || "user") }}>
      {!props.userConnected ? (
        <img alt="Profil placeholder" src={placeholder} className="w-full h-full object-cover opacity-90" />
      ) : props.userConnected.profilePictureUrl ? (
        <img alt="Profil" src={props.userConnected.profilePictureUrl!}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-semibold text-white select-none">{getInitials()}</span>
      )}
    </div>
  );
}

export default UserAvatar;
