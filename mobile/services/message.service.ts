import api from "./api";

import { Message } from "../types/message";

export interface MessagesResponse {
  page: number;
  limit: number;
  messages: Message[];
}

export async function getMessages(
  conversationId: number,
  page = 1,
  limit = 20
): Promise<MessagesResponse> {
  const response = await api.get<MessagesResponse>(
    `/conversations/${conversationId}/messages`,
    {
      params: {
        page,
        limit,
      },
    }
  );

  return response.data;
}