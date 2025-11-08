import type ConversationType from "./ConversationType";
import type { Message } from "./Message";
import type { User } from "./User";

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  type: ConversationType;
  title?: string;
  pictureUrl?: string;
  createdAt: Date
  updatedAt: Date
}
