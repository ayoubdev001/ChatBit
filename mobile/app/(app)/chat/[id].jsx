import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import ChatHeader from "../../../components/chat/ChatHeader";
import MessageBubble from "../../../components/chat/MessageBubble";
import MessageInput from "../../../components/chat/MessageInput";
import TypingIndicator from "../../../components/chat/TypingIndicator";
import { COLORS } from "../../../constants/colors";

const messages = [
  {
    id: "1",
    content: "Bonjour 👋 Comment pouvons-nous vous aider ?",
    time: "10:41",
    isMine: false,
  },
  {
    id: "2",
    content: "Bonjour, j'ai un problème avec ma commande.",
    time: "10:42",
    isMine: true,
    isRead: true,
  },
  {
    id: "3",
    content: "Bien sûr ! Pouvez-vous me donner votre numéro de commande ?",
    time: "10:43",
    isMine: false,
  },
  {
    id: "4",
    content: "Oui, c'est la commande #SB-2847.",
    time: "10:44",
    isMine: true,
    isRead: true,
  },
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [message, setMessage] = useState("");
  const [showTyping, setShowTyping] = useState(true);

  const handleSend = () => {
    if (!message.trim()) {
      return;
    }

    console.log("Conversation:", id);
    console.log("Message:", message);

    setMessage("");
    setShowTyping(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ChatHeader
        name="Support Souq Express"
        online={true}
      />

      <View style={styles.chatContainer}>
        <ScrollView
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              Aujourd'hui
            </Text>
          </View>

          {messages.map((item) => (
            <MessageBubble
              key={item.id}
              content={item.content}
              time={item.time}
              isMine={item.isMine}
              isRead={item.isRead}
            />
          ))}

          {showTyping && (
            <TypingIndicator name="Support" />
          )}
        </ScrollView>
      </View>

      <MessageInput
        value={message}
        onChangeText={setMessage}
        onSend={handleSend}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  chatContainer: {
    flex: 1,
  },

  messages: {
    flex: 1,
  },

  messagesContent: {
    paddingTop: 15,
    paddingBottom: 15,
  },

  dateContainer: {
    alignSelf: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  dateText: {
    color: COLORS.textSecondary,
    fontSize: 9,
    fontWeight: "600",
  },
});