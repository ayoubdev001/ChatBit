import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import  api  from "../../../api/axios";
import { getSocket } from "../../../api/socket";
import { useAuth } from "../../../context/AuthContext";
import ChatHeader from "../../../components/chat/ChatHeader";
import MessageBubble from "../../../components/chat/MessageBubble";
import MessageInput from "../../../components/chat/MessageInput";
import TypingIndicator from "../../../components/chat/TypingIndicator";
import Loading from "../../../components/ui/Loading";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import { COLORS } from "../../../constants/colors";

export default function ChatScreen() {
  const { id: conversationId } = useLocalSearchParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const flatListRef = useRef(null);

  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [messageText, setMessageText] = useState("");

  // 1. Fetch message history via REST API
  const {
    data: messages = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const response = await api.get(
        `/conversations/${conversationId}/messages`
      );
      return response.data.messages;
    },
    enabled: !!conversationId,
  });

  // 2. Fetch conversation status/details
  const { data: conversation } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      const response = await api.get(`/conversations`);
      const list = response.data || [];
      return list.find((c) => c.id.toString() === conversationId.toString());
    },
    enabled: !!conversationId,
  });

  // 3. Setup WebSocket room listeners
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !conversationId) return;

    // Join conversation room
    socket.emit("conversation:join", { conversationId });

    // Handle real-time incoming messages
    const handleNewMessage = (newMessage) => {
      if (newMessage.conversationId?.toString() === conversationId.toString()) {
        queryClient.setQueryData(["messages", conversationId], (old = []) => [
          ...old,
          newMessage,
        ]);
      }
    };

    // Handle typing status updates
    const handleTypingUpdate = ({ userId, username, isTyping: typingState }) => {
      if (userId !== user?.id) {
        setIsTyping(typingState);
        setTypingUser(username || "");
      }
    };

    socket.on("message:new", handleNewMessage);
    socket.on("typing:update", handleTypingUpdate);

    return () => {
      socket.emit("conversation:leave", { conversationId });
      socket.off("message:new", handleNewMessage);
      socket.off("typing:update", handleTypingUpdate);
    };
  }, [conversationId, queryClient, user]);

  // Handle sending a message
    const handleSendMessage = () => {
    const socket = getSocket();
    if (!socket || !messageText.trim()) return;

    socket.emit("message:send", {
      conversationId,
      content: messageText,
    });
    setMessageText("");
  };

  // Handle typing emissions
  const handleTypingStart = () => {
    const socket = getSocket();
    socket?.emit("typing:start", { conversationId });
  };

  const handleTypingStop = () => {
    const socket = getSocket();
    socket?.emit("typing:stop", { conversationId });
  };

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <ErrorMessage
        message={
          error?.response?.data?.error ||
          "Impossible de charger les messages."
        }
        onRetry={refetch}
      />
    );
  }

  const isClosed = conversation?.status === "fermee";

  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader conversation={conversation} currentUser={user} />

       <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior="padding"
          keyboardVerticalOffset={0}
       >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MessageBubble message={item} currentUserId={user?.id} />
          )}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        />

        {/* Typing indicator */}
        {isTyping && <TypingIndicator username={typingUser} />}

        {/* Input bar - disabled when conversation is closed */}
        <MessageInput
          value={messageText}
          onChangeText={setMessageText}
          onSend={handleSendMessage}
          onTypingStart={handleTypingStart}
          onTypingStop={handleTypingStop}
          disabled={isClosed}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});