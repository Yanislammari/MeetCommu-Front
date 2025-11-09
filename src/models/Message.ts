import type { User } from "./User";

export interface Message {
  id: string;
  content: string;
  attachmentsUrls?: string[];
  sender: User;
  isUpdated?: boolean;
  isDeleted?: boolean;
  createdAt: Date
  updatedAt: Date
}
