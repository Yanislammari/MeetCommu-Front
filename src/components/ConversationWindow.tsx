import React, { useEffect, useRef, useState } from "react";
import type { Conversation } from "../models/Conversation";
import type { Message } from "../models/Message";
import type { User } from "../models/User";
import ConversationType from "../models/ConversationType";
import MessageService from "../services/message.service";
import { toast } from "sonner";
import { useAuth } from "../providers/AuthProvider";
import MessageBubble from "./MessageBubble";
import FilePreview from "./FilePreview";
import { FaPaperclip, FaPaperPlane } from "react-icons/fa";

interface ConversationWindowProps {
  user: User;
  conversation: Conversation;
  initialMessages?: Message[];
}

const ConversationWindow: React.FC<ConversationWindowProps> = (props: ConversationWindowProps) => {
  const messageService = new MessageService();
  const { token } = useAuth();

  const [messages, setMessages] = useState<Message[]>(props.initialMessages ?? []);
  const [inputValue, setInputValue] = useState<string>("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const other = props.conversation.type === ConversationType.DIRECT ? props.conversation.participants.find((p) => p.id !== props.user.id) : null;

  useEffect(() => {
    setMessages(props.initialMessages ?? []);
    setInputValue("");
    setAttachedFiles([]);

    const unsubscribe = messageService.subscribeToMessages(props.conversation.id, (message) => setMessages((prev) => [...prev, message]));

    return () => unsubscribe();
  }, [props.conversation.id, props.initialMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() && attachedFiles.length === 0) {
      return;
    }

    try {
      await messageService.sendMessage(props.conversation.id, inputValue, token!, attachedFiles);
      setInputValue("");
      setAttachedFiles([]);
    }
    catch {
      toast.error("Failed to send message.");
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachedFiles(Array.from(e.target.files));
    }

    e.target.value = "";
  }

  const removeFile = (fileToRemove: File) => {
    setAttachedFiles((prev) => prev.filter((f) => f !== fileToRemove));
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-[#141425]">
        <img src={props.conversation.type === ConversationType.DIRECT ? other?.profilePictureUrl ?? "/placeholder.png" : props.conversation.pictureUrl ?? "/placeholder.png"} alt="Conversation" className="w-10 h-10 rounded-full object-cover" />
        <div>
          <p className="font-semibold text-white">{props.conversation.type === ConversationType.DIRECT ? other?.username ?? "Conversation" : props.conversation.title ?? "Conversation"}</p>
          <p className="text-xs text-gray-400">Online</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-3 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex justify-center text-gray-500 italic">
            <p>Start chatting!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} isSender={message.sender.id === props.user.id} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-white/10 bg-[#141425]">
        {attachedFiles.length > 0 && (
          <div className="mb-3 flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-[#2f2f47] pb-2">
            {attachedFiles.map((file) => (
              <FilePreview key={file.name} file={file} isInputPreview onRemove={() => removeFile(file)} />
            ))}
          </div>
        )}
        <div className="flex items-center gap-3">
          <input type="text" placeholder="Write message..." value={inputValue} onKeyDown={(e) => e.key === "Enter" && handleSend()} onChange={(e) => setInputValue(e.target.value)} className="flex-1 bg-[#1e1e2f] border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#9b8af7] focus:outline-none text-sm text-gray-200 placeholder-gray-500" />
          <input ref={fileInputRef} type="file" multiple onChange={handleFileChange} className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="flex items-center justify-center w-9 h-9 rounded-full bg-[#9b8af7]/20 hover:bg-[#9b8af7]/30 transition cursor-pointer">
            <FaPaperclip className="text-[#9b8af7] text-lg" />
          </label>
          <button onClick={handleSend} className="flex items-center justify-center w-9 h-9 rounded-full bg-[#9b8af7] hover:bg-[#7f72db] transition cursor-pointer">
            <FaPaperPlane className="text-white text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConversationWindow;
