import React, { useState } from "react";
import type { Message } from "../models/Message";
import FilePreview from "./FilePreview";
import { FaTrash, FaEdit, FaSmile } from "react-icons/fa";

interface MessageBubbleProps {
  message: Message;
  isSender: boolean;
  onEdit?: (message: Message) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = (props: MessageBubbleProps) => {
  const [showActions, setShowActions] = useState<boolean>(false);

  const messageTime = new Date(props.message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex flex-col max-w-xs ${ props.isSender ? "self-end items-end" : "self-start items-start" } relative`} onMouseEnter={() => setShowActions(true)} onMouseLeave={() => setShowActions(false)}>
      <div className={`flex items-end gap-2 ${ props.isSender ? "justify-end" : "justify-start" }`}>
        {props.isSender && (
          <div className="flex flex-col items-end">
            <span className="text-[11px] text-gray-500 select-none">{messageTime}</span>
            {props.message.isUpdated && (
              <span className="text-[10px] text-gray-500 italic select-none">(modifié)</span>
            )}
          </div>
        )}
        <div className={`px-4 py-2 text-sm rounded-2xl break-words ${ props.isSender ? "bg-[#9b8af7] text-white" : "bg-[#1e1e2f] text-gray-200" }`}>
          <p>{props.message.content}</p>
        </div>
        {!props.isSender && (
          <div className="flex flex-col items-start">
            <span className="text-[11px] text-gray-500 select-none">{messageTime}</span>
            {props.message.isUpdated && (
              <span className="text-[10px] text-gray-500 italic select-none">(modifié)</span>
            )}
          </div>
        )}
      </div>
      {props.message.attachmentsUrls && props.message.attachmentsUrls.length > 0 && (
        <div className={`mt-2 grid gap-3 ${ props.message.attachmentsUrls.length > 1 ? "grid-cols-2" : "grid-cols-1" }`}>
          {props.message.attachmentsUrls.map((url) => (
            <FilePreview key={url} url={url} />
          ))}
        </div>
      )}
      {showActions && (
        <div className={`absolute ${ props.isSender ? "right-0" : "left-0" } flex items-center gap-2 bg-[#1e1e2f]/90 border border-white/10 rounded-full px-3 py-1.5 shadow-md backdrop-blur-md transition-all duration-200 ease-out translate-y-full mt-1 z-99`}>
          {props.isSender ? (
            <React.Fragment>
              <button onClick={() => {}} title="Delete the message" className="text-gray-400 hover:text-red-400 transition cursor-pointer">
                <FaTrash size={13} />
              </button>
              <button onClick={() => props.onEdit?.(props.message)} title="Edit the message" className="text-gray-400 hover:text-yellow-400 transition cursor-pointer">
                <FaEdit size={13} />
              </button>
              <button onClick={() => {}} title="React" className="text-gray-400 hover:text-[#9b8af7] transition cursor-pointer">
                <FaSmile size={14} />
              </button>
            </React.Fragment>
          ) : (
            <button onClick={() => {}} title="React" className="text-gray-400 hover:text-[#9b8af7] transition cursor-pointer">
              <FaSmile size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default MessageBubble;
