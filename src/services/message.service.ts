import type { Message } from "../models/Message";
import GraphQLService from "./graphql.service";
import { createClient } from "graphql-ws";
import type { Client } from "graphql-ws";

interface MessageSentSubscriptionPayload {
  messageSent: Message;
}

class MessageService extends GraphQLService {
  private readonly wsClient: Client;

  constructor() {
    super();
    this.wsClient = createClient({
      url: `${import.meta.env.VITE_WS_BASE_URL}/graphql`,
      connectionParams: () => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
      }
    });
  }
  
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
          attachmentsUrls
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

  public async sendMessage(conversationId: string, content: string, token: string, attachments?: File[]): Promise<Message> {
    const mutation: string = `
      mutation SendMessage($conversationId: ID!, $input: CreateMessageInput!, $files: [Upload!]) {
        sendMessage(conversationId: $conversationId, input: $input, files: $files) {
          id
          content
          attachmentsUrls
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
      conversationId,
      input: {
        content
      },
      files: attachments ? new Array(attachments.length).fill(null) : undefined
    }

    const formData: FormData = new FormData();
    formData.append(
      "operations",
      JSON.stringify({
        query: mutation,
        variables: variables
      })
    );

    if (attachments && attachments.length > 0) {
      const map: Record<string, string[]> = {};
      attachments.forEach((_, index) => {
        map[`${index}`] = [`variables.files.${index}`];
      });

      formData.append("map", JSON.stringify(map));

      attachments.forEach((file, index) => {
        formData.append(`${index}`, file);
      });
    }
    else {
      formData.append("map", JSON.stringify({}));
    }

    const response = await this.request<{sendMessage: Message}>(mutation, variables, token, formData);
    return response.sendMessage;
  }

  public subscribeToMessages(conversationId: string, onMessage: (msg: Message) => void): () => void {
    const dispose = this.wsClient.subscribe<MessageSentSubscriptionPayload>({
      query: `
        subscription OnMessageSent($conversationId: ID!) {
          messageSent(conversationId: $conversationId) {
            id
            content
            attachmentsUrls
            createdAt
            sender {
              id
              username
              profilePictureUrl
            }
          }
        }
      `,
      variables: { conversationId },
    }, {
      next: (payload) => {
        const message = payload.data?.messageSent;
        if (message) onMessage(message);
      },
      error: (err) => console.error("Subscription error:", err),
      complete: () => console.log("Subscription complete"),
    });

    return () => {
      dispose();
    }
  }
}

export default MessageService;
