import type { Conversation } from "../models/Conversation";
import type { Message } from "../models/Message";
import GraphQLService from "./graphql.service";

class ConversationService extends GraphQLService {
  public async getLastMessageOfConversation(conversationId: string): Promise<Message> {
    const query: string = `
      query LastMessageOfConversation($conversationId: ID!) {
        lastMessageOfConversation(conversationId: $conversationId) {
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
  
    const variables = { conversationId };
  
    const response = await this.request<{ lastMessageOfConversation: Message }>(query, variables);
    return response.lastMessageOfConversation;
  }  

  public async getConversationsOfUser(userId: string): Promise<Conversation[]> {
    const query: string = `
      query ConversationsOfUser($userId: ID!) {
        conversationsOfUser(userId: $userId) {
          id
          title
          type
          pictureUrl
          createdAt
          updatedAt
          
          participants {
            id
            firstName
            lastName
            username
            email
            profilePictureUrl
          }
  
          messages {
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
              profilePictureUrl
            }
          }
        }
      }
    `;
  
    const variables = { userId };
  
    const response = await this.request<{ conversationsOfUser: Conversation[] }>(query, variables);
    return response.conversationsOfUser;
  }
}

export default ConversationService;
