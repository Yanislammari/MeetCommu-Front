import type React from "react";
import type { User } from "../models/User";
import type { Conversation } from "../models/Conversation";
import type { Message } from "../models/Message";
import UserAvatar from "./UserAvatar";
import ConversationType from "../models/ConversationType";
import { getTimestamp } from "../utils/Timestamp";
import Size from "../models/Size";

interface ConversationItemProps {
  conversation: Conversation;
  otherUser?: User;
  lastMessage?: Message;
  isSelected: boolean;
  onSelect: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = (props: ConversationItemProps) => {
  const displayName = props.conversation.type === ConversationType.DIRECT ? props.otherUser?.username ?? "Unknown" : props.conversation.title;
  const timestamp = props.lastMessage ? getTimestamp(new Date(props.lastMessage.createdAt)) : "";

  return (
    <div onClick={props.onSelect} className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all hover:bg-[#1e1e2f] ${ props.isSelected ? "bg-[#1e1e2f]" : "" }`}>
      {props.conversation.type === ConversationType.DIRECT && props.otherUser ? (
        <UserAvatar user={props.otherUser} size={Size.MD} />
      ) : props.conversation.pictureUrl ? (
        <img src={props.conversation.pictureUrl} alt={displayName ?? "?"} className="w-10 h-10 rounded-full object-cover"/>
      ) : (
        <div className="w-10 h-10 rounded-full bg-[#2a2a3d] flex items-center justify-center text-[#9b8af7] font-semibold">
          <p>{displayName ? displayName.charAt(0).toUpperCase() : "?"}</p>
        </div>
      )}
      <div className="flex-1">
        <p className="font-medium text-gray-100">{displayName ?? "Unknown"}</p>
        <p className="text-sm text-gray-400 truncate">{props.lastMessage?.content ?? "No messages yet"}</p>
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap">{timestamp}</span>
    </div>
  );
}

export default ConversationItem;
