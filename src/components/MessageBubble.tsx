import React from "react";
import type { Message } from "../models/Message";

interface MessageBubbleProps {
  message: Message;
  isSender: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isSender }) => {
  const messageTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex items-end gap-2 ${ isSender ? "justify-end self-end" : "justify-start self-start" }`}>
      {isSender && (
        <span className="text-[11px] text-gray-500 select-none">{messageTime}</span>
      )}
      <div className={`max-w-xs px-4 py-2 text-sm rounded-2xl break-words ${ isSender ? "bg-[#9b8af7] text-white" : "bg-[#1e1e2f] text-gray-200" }`}>
        <p>{message.content}</p>
      </div>
      {!isSender && (
        <span className="text-[11px] text-gray-500 select-none">{messageTime}</span>
      )}
    </div>
  );
}

export default MessageBubble;
