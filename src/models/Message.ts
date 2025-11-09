import type { User } from "./User";

export interface Message {
  id: string;
  content: string;
  attachmentsUrls?: string[];
  sender: User;
  isUpdated?: boolean;
  createdAt: Date
  updatedAt: Date
}
