import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { COLORS } from "../../constants/colors";

// value — current text in the input
// onChangeText — called every time the user types
// onSend — called when the send button is pressed
// disabled — true when the conversation is closed, blocks typing and sending
export default function MessageInput({ value, onChangeText, onSend, disabled = false }) {
  // Can only send if there is text AND the conversation is not closed
  const canSend = value.trim().length > 0 && !disabled;

  return (
    <View style={styles.container}>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Écrire un message..."
        placeholderTextColor={COLORS.textSecondary}
        style={styles.input}
        multiline
        maxLength={1000}
        // Prevent typing when conversation is closed
        editable={!disabled}
      />

      <Pressable
        onPress={onSend}
        disabled={!canSend}
        style={[
          styles.sendButton,
          // Dim the button when there is nothing to send
          !canSend && styles.sendButtonDisabled,
        ]}
      >
        <Text style={styles.sendIcon}>➤</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 70,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },

  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 100,
    backgroundColor: COLORS.background,
    borderRadius: 21,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: COLORS.text,
    fontSize: 13,
  },

  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  sendButtonDisabled: {
    opacity: 0.4,
  },

  sendIcon: {
    color: COLORS.white,
    fontSize: 17,
    marginLeft: 2,
  },
});