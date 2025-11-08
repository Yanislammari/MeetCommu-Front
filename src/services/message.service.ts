import type { Message } from "../models/Message";
import GraphQLService from "./graphql.service";

class MessageService extends GraphQLService {
  public async getMessageById(id: string): Promise<Message> {
    const query: string = `
      query Message($id: ID!) {
        message(id: $id)
      }
    `;

    const variables = {
      id
    }

    const response = await this.request<{message: Message}>(query, variables);
    return response.message;
  }

  public async getMessagesByConversationId(conversationId: string): Promise<Message[]> {
    const query: string = `
      query MessagesOfConversation($conversationId: ID!) {
        messagesOfConversation(conversationId: $conversationId) {
          id
          content
          attachementsUrls
          isUpdated
          createdAt
          updatedAt
          sender {
            id
            firstName
            lastName
            username
            profilePictureUrl
          }
        }
      }
    `;

    const variables = {
      conversationId
    }

    const response = await this.request<{messagesOfConversation: Message[]}>(query, variables);
    return response.messagesOfConversation;
  }
}

export default MessageService;
