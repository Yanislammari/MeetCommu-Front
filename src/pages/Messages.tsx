import type React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { MENU_ITEMS } from "../constants/MenuItems";
import { useAuth } from "../providers/AuthProvider";
import { useEffect, useState } from "react";
import ConversationPanel from "../components/ConversationPanel";
import ConversationService from "../services/ConversationService";
import type { Conversation } from "../models/Conversation";
import { toast } from "sonner";
import MessageService from "../services/MessageService";
import type { Message } from "../models/Message";
import ConversationWindow from "../components/ConversationWindow";

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
      if (!user?.id){
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
    };
    fetchConversations();
  }, [user]);

  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);

    try {
      const messagesData = await messageService.getMessagesByConversationId(conversation.id);
      setMessages(messagesData ?? []);
    }
    catch {
      toast.error("Failed to load conversation messages.");
    }
  }

  return (
    <div className="flex h-screen bg-[#0f0f1a] text-white overflow-hidden">
      <Sidebar menuItems={MENU_ITEMS} userConnected={user} />
      <main className="flex-1 flex flex-col min-w-0">
        <Navbar userConnected={user} />
        <div className="flex flex-1 overflow-hidden min-w-0">
          <section className="flex-1 flex flex-col bg-[#0f0f1a] min-w-0">
            {loading ? (
              <div className="flex items-center justify-center flex-1 text-gray-400">
                <p>Loading conversations...</p>
              </div>
            ) : selectedConversation ? (
              <ConversationWindow user={user!} conversation={selectedConversation} initialMessages={messages} />
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
                <p className="text-lg mb-2">No conversation selected.</p>
                <p className="text-sm opacity-70">Select a conversation to start chatting!</p>
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
