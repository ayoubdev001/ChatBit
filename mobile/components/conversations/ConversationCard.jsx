import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/colors";
import StatusBadge from "./StatusBadge";

export default function ConversationCard({ conversation, onPress }) {
  const { subject, status, createdAt } = conversation;

  const time = new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      {/* Avatar — shows the first letter of support */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>S</Text>
      </View>

      <View style={styles.content}>
        {/* Top row — subject on the left, time on the right */}
        <View style={styles.topRow}>
          <Text
            style={styles.subject}
            numberOfLines={1}
          >
            {subject}
          </Text>

          <Text style={styles.time}>{time}</Text>
        </View>

        {/* Colored dot + label showing conversation status */}
        <StatusBadge status={status} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  pressed: {
    opacity: 0.75,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#E9D8F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatarText: {
    color: COLORS.border,
    fontSize: 18,
    fontWeight: "800",
  },

  content: {
    flex: 1,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  subject: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
    marginRight: 8,
  },

  time: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },
});