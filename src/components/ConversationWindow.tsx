import React, { useEffect, useRef, useState } from "react";
import type { Conversation } from "../models/Conversation";
import type { Message } from "../models/Message";
import type { User } from "../models/User";
import ConversationType from "../models/ConversationType";
import MessageService from "../services/MessageService";
import { toast } from "sonner";
import { useAuth } from "../providers/AuthProvider";
import MessageBubble from "./MessageBubble";
import FilePreview from "./FilePreview";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { FaPaperclip, FaPaperPlane, FaEdit, FaTimes } from "react-icons/fa";

interface ConversationWindowProps {
  user: User;
  conversation: Conversation;
  initialMessages?: Message[];
}

const ConversationWindow: React.FC<ConversationWindowProps> = (props) => {
  const messageService = new MessageService();
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>(props.initialMessages ?? []);
  const [inputValue, setInputValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<string[]>([]);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const other = props.conversation.type === ConversationType.DIRECT ? props.conversation.participants.find((p) => p.id !== props.user.id) : null;

  useEffect(() => {
    setMessages(props.initialMessages ?? []);
    setInputValue("");
    setAttachedFiles([]);
    setExistingAttachments([]);
    setEditingMessage(null);

    const unsubscribeSent = messageService.subscribeToMessageSent(props.conversation.id, (message) => setMessages((prev) => [...prev, message]));
    const unsubscribeUpdated = messageService.subscribeToMessageUpdated(props.conversation.id, (updatedMessage) => setMessages((prev) => prev.map((message) => message.id === updatedMessage.id ? { ...updatedMessage, isUpdated: true } : message)));
    const unsubscribeDeleted = messageService.subscribeToMessageDeleted(props.conversation.id, (deletedId) => setMessages((prev) => prev.map((message) => message.id === deletedId ? { ...message, isDeleted: true, content: "This message have been deleted", attachmentsUrls: [] } : message)));    

    return () => {
      unsubscribeSent();
      unsubscribeUpdated();
      unsubscribeDeleted();
    };
  }, [props.conversation.id, props.initialMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const combineAllFiles = async (): Promise<File[]> => {
    const finalFiles: File[] = [];

    for (const url of existingAttachments) {
      try {
        const response: Response = await fetch(url);
        const blob: Blob = await response.blob();
        const rawName: string = url.split("/").pop() || "file";
        const cleanName: string = rawName.includes("-") ? rawName.split("-").slice(1).join("-") : rawName;

        const file = new File([blob], cleanName, {
          type: blob.type || "application/octet-stream",
        });
        
        finalFiles.push(file);
      }
      catch {
        toast.error("An error occurred with an attachment of a message.");
      }
    }

    finalFiles.push(...attachedFiles);
    return finalFiles;
  }

  const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items: DataTransferItemList = e.clipboardData?.items;
    if (!items) {
      return;
    }
  
    const pastedFiles: File[] = [];
    let shouldPreventDefault: boolean = false;
  
    for (const item of items) {
      if (item.kind === "file") {
        const file: File | null = item.getAsFile();
        if (file) {
          pastedFiles.push(file);
          shouldPreventDefault = true;
        }
      }
      else if (item.type.startsWith("image/")) {
        const blob: File | null = item.getAsFile();
        if (blob) {
          const file = new File([blob], `pasted-image-${Date.now()}.png`, { type: blob.type });
          pastedFiles.push(file);
          shouldPreventDefault = true;
        }
      }
    }
  
    if (shouldPreventDefault) {
      e.preventDefault();
    }
  
    if (pastedFiles.length > 0) {
      setAttachedFiles((prev) => [...prev, ...pastedFiles]);
    }
  }

  const handleSend = async () => {
    if (!inputValue.trim() && attachedFiles.length === 0 && existingAttachments.length === 0) {
      return;
    }

    try {
      if (editingMessage) {
        const filesToSend = await combineAllFiles();
        const updated = await messageService.editMessage(editingMessage.id, inputValue, token!, filesToSend);
        setMessages((prev) => prev.map((message) => message.id === updated.id ? { ...updated, isUpdated: true } : message));
        toast.success("Message updated.");
        setEditingMessage(null);
      }
      else {
        await messageService.sendMessage(props.conversation.id, inputValue, token!, attachedFiles);
      }

      setInputValue("");
      setAttachedFiles([]);
      setExistingAttachments([]);
      setFileInputKey((key) => key + 1);
    }
    catch {
      toast.error("Failed to send message.");
    }
  }

  const handleEdit = (message: Message) => {
    setEditingMessage(message);
    setInputValue(message.content);
    setAttachedFiles([]);
    setExistingAttachments(message.attachmentsUrls ?? []);
    setFileInputKey((key) => key + 1);
  }

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setInputValue("");
    setAttachedFiles([]);
    setExistingAttachments([]);
    setFileInputKey((key) => key + 1);
  }

  const handleDelete = (message: Message) => {
    setMessageToDelete(message);
  }

  const confirmDelete = async () => {
    if (!messageToDelete) {
      return;
    }

    try {
      await messageService.deleteMessage(messageToDelete.id, token!);
      setMessageToDelete(null);
      toast.success("Message deleted.");
    }
    catch {
      toast.error("Failed to delete message.");
    }
  }

  const cancelDelete = () => {
    setMessageToDelete(null);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      setAttachedFiles((prev) => [...prev, ...files]);
      setFileInputKey((key) => key + 1);
    }
  }

  const removeFile = (fileToRemove: File) => {
    setAttachedFiles((prev) => prev.filter((file) => file !== fileToRemove));
  }

  const removeExistingAttachment = (urlToRemove: string) => {
    setExistingAttachments((prev) => prev.filter((url) => url !== urlToRemove));
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
            <MessageBubble key={message.id} message={message} isSender={message.sender.id === props.user.id} onEdit={handleEdit} onDelete={handleDelete} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-white/10 bg-[#141425]">
        {(attachedFiles.length > 0 || existingAttachments.length > 0) && (
          <div className="mb-3 flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-[#2f2f47] pb-2">
            {existingAttachments.map((url) => (
              <FilePreview key={url} url={url} isInputPreview onRemove={() => removeExistingAttachment(url)} />
            ))}
            {attachedFiles.map((file) => (
              <FilePreview key={file.name} file={file} isInputPreview onRemove={() => removeFile(file)} />
            ))}
          </div>
        )}
        <div className="flex items-center gap-3">
          <input type="text" placeholder={editingMessage ? "Edit your message..." : "Write message..."} value={inputValue} onKeyDown={(e) => e.key === "Enter" && handleSend()} onChange={(e) => setInputValue(e.target.value)} onPaste={handlePaste} className="flex-1 bg-[#1e1e2f] border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#9b8af7] focus:outline-none text-sm text-gray-200 placeholder-gray-500" />
          {editingMessage && (
            <button onClick={handleCancelEdit} title="Cancel the edit" className="flex items-center justify-center w-9 h-9 rounded-full bg-red-500/20 hover:bg-red-500/40 transition cursor-pointer">
              <FaTimes className="text-red-400 text-lg" />
            </button>
          )}
          <input key={fileInputKey} type="file" multiple onChange={handleFileChange} className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="flex items-center justify-center w-9 h-9 rounded-full bg-[#9b8af7]/20 hover:bg-[#9b8af7]/30 transition cursor-pointer">
            <FaPaperclip className="text-[#9b8af7] text-lg" />
          </label>
          <button onClick={handleSend} className={`flex items-center justify-center w-9 h-9 rounded-full ${editingMessage ? "bg-yellow-500 hover:bg-yellow-400" : "bg-[#9b8af7] hover:bg-[#7f72db]"} transition cursor-pointer`}>
            {editingMessage ? (
              <FaEdit className="text-white text-sm" />
            ) : (
              <FaPaperPlane className="text-white text-sm" />
            )}
          </button>
        </div>
      </div>
      <DeleteConfirmationModal isOpen={!!messageToDelete} onConfirm={confirmDelete} onCancel={cancelDelete} />
    </div>
  );
}

export default ConversationWindow;
