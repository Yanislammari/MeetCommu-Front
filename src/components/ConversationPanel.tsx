import type React from "react";
import type { Conversation } from "../models/Conversation";
import { useState, useEffect } from "react";
import ConversationType from "../models/ConversationType";
import type { Message } from "../models/Message";
import { useAuth } from "../providers/AuthProvider";
import ConversationService from "../services/conversation.service";
import { toast } from "sonner";
import ConversationItem from "./ConversationItem";
import type { User } from "../models/User";

interface ConversationPanelProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conv: Conversation) => void;
}

const ConversationPanel: React.FC<ConversationPanelProps> = (props: ConversationPanelProps) => {
  const { user } = useAuth();
  const conversationService = new ConversationService();
  const [lastMessages, setLastMessages] = useState<Record<string, Message>>({});

  const getOtherUserOfConversation = (conversation: Conversation): User | undefined => {
    if (conversation.type !== ConversationType.DIRECT) {
      return undefined;
    }

    return conversation.participants.find((p) => p.id !== user?.id);
  }

  const getLastMessageOfConversation = async (conversation: Conversation) => {
    try {
      const lastMessage = await conversationService.getLastMessageOfConversation(conversation.id);
      setLastMessages((prev) => ({ ...prev, [conversation.id]: lastMessage }));
    }
    catch {
      toast.error("Error fetching last messages.");
    }
  }

  useEffect(() => {
    props.conversations.forEach((conversation) => getLastMessageOfConversation(conversation));
  }, [props.conversations]);

  return (
    <aside className="w-80 border-l border-white/10 bg-[#141425] flex flex-col">
      <div className="px-4 py-3 border-b border-white/10">
        <h2 className="text-lg font-semibold text-[#9b8af7]">Conversations</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {props.conversations.map((conversation) => {
          const otherUser: User | undefined = getOtherUserOfConversation(conversation);
          const lastMessage: Message = lastMessages[conversation.id];

          return (
            <ConversationItem key={conversation.id} conversation={conversation} otherUser={otherUser} lastMessage={lastMessage} isSelected={props.selectedConversation?.id === conversation.id} onSelect={() => props.onSelectConversation(conversation)} />
          );
        })}
      </div>
    </aside>
  );
}

export default ConversationPanel;
