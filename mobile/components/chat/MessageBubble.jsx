import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/colors";

interface MessageBubbleProps {
  content: string;
  time: string;
  isMine: boolean;
  isRead?: boolean;
}

export default function MessageBubble({
  content,
  time,
  isMine,
  isRead = false,
}: MessageBubbleProps) {
  return (
    <View
      style={[
        styles.container,
        isMine ? styles.mineContainer : styles.theirContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isMine ? styles.mineBubble : styles.theirBubble,
        ]}
      >
        <Text
          style={[
            styles.message,
            isMine ? styles.mineText : styles.theirText,
          ]}
        >
          {content}
        </Text>

        <View style={styles.meta}>
          <Text
            style={[
              styles.time,
              isMine && styles.mineTime,
            ]}
          >
            {time}
          </Text>

          {isMine && (
            <Text
              style={[
                styles.check,
                isRead && styles.readCheck,
              ]}
            >
              ✓✓
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 10,
    paddingHorizontal: 16,
  },

  mineContainer: {
    alignItems: "flex-end",
  },

  theirContainer: {
    alignItems: "flex-start",
  },

  bubble: {
    maxWidth: "78%",
    paddingHorizontal: 14,
    paddingTop: 11,
    paddingBottom: 8,
    borderRadius: 18,
  },

  mineBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 5,
  },

  theirBubble: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  message: {
    fontSize: 13,
    lineHeight: 19,
  },

  mineText: {
    color: COLORS.white,
  },

  theirText: {
    color: COLORS.text,
  },

  meta: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
  },

  time: {
    color: COLORS.textSecondary,
    fontSize: 9,
  },

  mineTime: {
    color: "rgba(255,255,255,0.7)",
  },

  check: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    marginLeft: 4,
  },

  readCheck: {
    color: "#B8F2FF",
  },
});