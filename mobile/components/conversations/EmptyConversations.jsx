import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/colors";

export default function EmptyConversations({ role }) {
  const isAgent = role === "agent";

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>💬</Text>
      </View>

      <Text style={styles.title}>
        {isAgent ? "No Requests Yet" : "No Conversations"}
      </Text>

      <Text style={styles.description}>
        {isAgent
          ? "No clients have submitted support tickets yet. New requests will appear here."
          : "You don't have any ongoing conversations. Tap \"+ New\" to reach out to support."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 60,
  },

  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  icon: {
    fontSize: 30,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 8,
  },

  description: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});