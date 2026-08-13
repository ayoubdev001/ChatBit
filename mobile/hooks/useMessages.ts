import { useQuery } from "@tanstack/react-query";

import {
  getMessages,
} from "../services/message.service";

export function useMessages(
  conversationId: number
) {
  return useQuery({
    queryKey: [
      "messages",
      conversationId,
    ],

    queryFn: () =>
      getMessages(conversationId),

    enabled: !!conversationId,
  });
}