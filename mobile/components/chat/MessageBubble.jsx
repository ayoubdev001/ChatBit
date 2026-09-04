import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/colors";

// message — the message object from the backend: { id, conversationId, senderId, content, createdAt }
// currentUserId — the logged-in user's id, used to determine which side the bubble is on
export default function MessageBubble({ message, currentUserId }) {
  const { content, senderId, createdAt } = message;
  const isMine = senderId === currentUserId;

  const time = new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

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

          {/* Only show checkmarks on my own messages */}
          {isMine && (
            <Text style={styles.check}>
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
    maxWidth: "100%",
    paddingHorizontal: 30,
    paddingTop: 7,
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
    marginTop: 1,
  },

  time: {
    color: COLORS.textSecondary,
    fontSize: 7,
  },

 
  mineTime: {
    color: "rgba(255,255,255,0.7)",
  },

  
  check: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    marginLeft: 4,
  },
});