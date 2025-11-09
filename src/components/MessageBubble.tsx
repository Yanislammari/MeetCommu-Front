import React from "react";
import type { Message } from "../models/Message";
import FilePreview from "./FilePreview";

interface MessageBubbleProps {
  message: Message;
  isSender: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = (props: MessageBubbleProps) => {
  const messageTime = new Date(props.message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex flex-col max-w-xs ${ props.isSender ? "self-end items-end" : "self-start items-start" }`}>
      <div className={`flex items-end gap-2 ${ props.isSender ? "justify-end" : "justify-start" }`}>
        {props.isSender && (
          <span className="text-[11px] text-gray-500 select-none">{messageTime}</span>
        )}
        <div className={`px-4 py-2 text-sm rounded-2xl break-words ${ props.isSender ? "bg-[#9b8af7] text-white" : "bg-[#1e1e2f] text-gray-200" }`}>
          <p>{props.message.content}</p>
        </div>
        {!props.isSender && (
          <span className="text-[11px] text-gray-500 select-none">{messageTime}</span>
        )}
      </div>
      {props.message.attachmentsUrls && props.message.attachmentsUrls.length > 0 && (
        <div className={`mt-2 grid gap-3 ${ props.message.attachmentsUrls.length > 1 ? "grid-cols-2" : "grid-cols-1" }`}>
          {props.message.attachmentsUrls.map((url) => (
            <FilePreview key={url} url={url} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MessageBubble;
