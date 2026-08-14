export type ConversationStatus =
  | "en_attente"
  | "en_cours"
  | "fermee";

export interface Conversation {
  id: number;
  subject: string;
  status: ConversationStatus;
  clientId: number;
  agentId: number | null;
  createdAt: string;
  closedAt: string | null;
}