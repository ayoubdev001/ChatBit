import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { COLORS } from "../../constants/colors";

interface MessageInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export default function MessageInput({
  value,
  onChangeText,
  onSend,
  disabled = false,
}: MessageInputProps) {
  const canSend = value.trim().length > 0 && !disabled;

  return (
    <View style={styles.container}>
      <Pressable style={styles.plusButton}>
        <Text style={styles.plus}>+</Text>
      </Pressable>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Écrire un message..."
        placeholderTextColor={COLORS.textSecondary}
        style={styles.input}
        multiline
        maxLength={1000}
        editable={!disabled}
      />

      <Pressable
        onPress={onSend}
        disabled={!canSend}
        style={[
          styles.sendButton,
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

  plusButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },

  plus: {
    color: COLORS.primary,
    fontSize: 23,
    fontWeight: "400",
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