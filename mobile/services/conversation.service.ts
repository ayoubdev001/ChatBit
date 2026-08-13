import api from "./api";

import {
  Conversation,
} from "../types/conversation";

export interface CreateConversationData {
  subject: string;
  agentId: number;
}

export interface Agent {
  id: number;
  fullname: string;
  email: string;
  role: "agent";
  isOnline?: boolean;
}

export async function getConversations(): Promise<Conversation[]> {
  const response = await api.get<Conversation[]>(
    "/conversations"
  );

  return response.data;
}

export async function getAgents(): Promise<Agent[]> {
  const response = await api.get<{ agents: Agent[] }>(
    "/users/agents"
  );

  return response.data.agents;
}

export async function createConversation(
  data: CreateConversationData
): Promise<Conversation> {
  const response = await api.post<Conversation>(
    "/conversations",
    data
  );

  return response.data;
}

export async function getConversationMessages(
  conversationId: number,
  page = 1,
  limit = 20
) {
  const response = await api.get(
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

export async function closeConversation(
  conversationId: number
): Promise<Conversation> {
  const response = await api.patch<Conversation>(
    `/conversations/${conversationId}/close`
  );

  return response.data;
}