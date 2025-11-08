import type React from "react";
import { useEffect, useState } from "react";
import type { Conversation } from "../models/Conversation";
import type { Message } from "../models/Message";
import type { User } from "../models/User";
import ConversationType from "../models/ConversationType";
import MessageService from "../services/message.service";
import { toast } from "sonner";
import { useAuth } from "../providers/AuthProvider";

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

  const other = props.conversation.type === ConversationType.DIRECT ? props.conversation.participants.find((p) => p.id !== props.user.id) : null;

  useEffect(() => {
    setMessages(props.initialMessages ?? []);
    setInputValue("");
    setAttachedFiles([]);

    const unsubscribe = messageService.subscribeToMessages(props.conversation.id,(message) => setMessages((prev) => [...prev, message]));

    return () => unsubscribe();
  }, [props.conversation.id, props.initialMessages]);

  const handleSend = async () => {
    if (!inputValue.trim() && attachedFiles.length === 0){
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
          messages.map((message) => {
            const isMine = message.sender.id === props.user.id;
            return (
              <div key={message.id} className={`max-w-xs px-4 py-2 text-sm rounded-2xl break-words ${ isMine ? "self-end bg-[#9b8af7] text-white" : "self-start bg-[#1e1e2f] text-gray-200" }`}>
                <p>{message.content}</p>
              </div>
            );
          })
        )}
      </div>
      <div className="p-4 border-t border-white/10 bg-[#141425]">
        <div className="flex items-center gap-3">
          <input type="text" placeholder="Write message..." value={inputValue} onKeyDown={(e) => e.key === "Enter" && handleSend()} onChange={(e) => setInputValue(e.target.value)} className="flex-1 bg-[#1e1e2f] border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#9b8af7] focus:outline-none text-sm text-gray-200 placeholder-gray-500" />
          <input type="file" multiple onChange={(e) => setAttachedFiles(Array.from(e.target.files ?? []))} className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="cursor-pointer text-gray-400 hover:text-[#9b8af7] text-sm">📎</label>
          <button onClick={handleSend} className="btn btn-sm bg-[#9b8af7] hover:bg-[#7f72db] border-none text-white">
            <p>Send</p>
          </button>
        </div>
        {attachedFiles.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-400">
            {attachedFiles.map((file, i) => (
              <span key={i} className="bg-[#1e1e2f] px-2 py-1 rounded">{file.name}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ConversationWindow;
