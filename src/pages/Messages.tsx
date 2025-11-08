import type React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { MENU_ITEMS } from "../constants/MenuItems";
import { useAuth } from "../providers/AuthProvider";
import { useEffect, useState } from "react";
import ConversationPanel from "../components/ConversationPanel";
import ConversationService from "../services/conversation.service";
import type { Conversation } from "../models/Conversation";
import type { Message } from "../models/Message";
import { toast } from "sonner";
import MessageService from "../services/message.service";
import ConversationType from "../models/ConversationType";
import type { User } from "../models/User";

const Messages: React.FC = () => {
  const { user } = useAuth();
  const conversationService = new ConversationService();
  const messageService = new MessageService();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const conversationsData: Conversation[] = await conversationService.getConversationsOfUser(user.id);
        setConversations(conversationsData);
      }
      catch {
        toast.error("Error during fetching user conversations.");
      }
      finally {
        setLoading(false);
      }
    }

    fetchConversations();
  }, [user]);

  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);

    try {
      const messagesData: Message[] = await messageService.getMessagesByConversationId(conversation.id);
      setMessages(messagesData ?? []);
    }
    catch {
      toast.error("Failed to load conversation messages.");
    }
  }

  return (
    <div className="flex h-screen bg-[#0f0f1a] text-white overflow-hidden">
      <Sidebar menuItems={MENU_ITEMS} userConnected={user} />
      <main className="flex-1 flex flex-col">
        <Navbar userConnected={user} />
        <div className="flex flex-1 overflow-hidden">
          <section className="flex-1 flex flex-col bg-[#0f0f1a]">
            {loading ? (
              <div className="flex items-center justify-center flex-1 text-gray-400">
                <p>Loading conversations...</p>
              </div>
            ) : selectedConversation ? (
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-[#141425]">
                  {selectedConversation.type === ConversationType.DIRECT ? (
                    (() => {
                      const other: User | undefined = selectedConversation.participants.find((p) => p.id !== user?.id);

                      return (
                        <div className="flex gap-3">
                          <img src={other?.profilePictureUrl ?? "/placeholder.png"} alt={other?.username ?? "Conversation"} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <p className="font-semibold text-white">{other?.username ?? "Conversation"}</p>
                            <p className="text-xs text-gray-400">Online</p>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div>
                      <img src={selectedConversation.pictureUrl ?? "/placeholder.png"} alt={selectedConversation.title ?? "Unknown"} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-white">{selectedConversation.title ?? "Conversation"}</p>
                        <p className="text-xs text-gray-400">Online</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-3 flex flex-col">
                  {messages.length === 0 && (
                    <div className="flex justify-center text-gray-500 italic">
                      <p>Start chating !</p>
                    </div>
                  )}
                  {messages.map((message) => {
                    const isMine: boolean = message.sender.id === user?.id;

                    return (
                      <div key={message.id} className={`max-w-xs px-4 py-2 text-sm rounded-2xl break-words ${ isMine ? "self-end bg-[#9b8af7] text-white" : "self-start bg-[#1e1e2f] text-gray-200" }`}>
                        <p>{message.content}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="p-4 border-t border-white/10 bg-[#141425]">
                  <div className="flex items-center gap-3">
                    <input type="text" placeholder="Write message..." className="flex-1 bg-[#1e1e2f] border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#9b8af7] focus:outline-none text-sm text-gray-200 placeholder-gray-500" />
                    <button className="btn btn-sm bg-[#9b8af7] hover:bg-[#7f72db] border-none text-white">
                      <p>Send</p>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
                <p className="text-lg mb-2">No conversation selected.</p>
                <p className="text-sm opacity-70"> Select a conversation to start chating!</p>
              </div>
            )}
          </section>
          <ConversationPanel conversations={conversations} onSelectConversation={handleSelectConversation} selectedConversation={selectedConversation} />
        </div>
      </main>
    </div>
  );
}

export default Messages;
