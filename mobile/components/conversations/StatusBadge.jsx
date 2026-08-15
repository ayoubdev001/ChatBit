import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/colors";

// status — one of three values that come from the backend:
// "en_attente" → waiting for an agent to join
// "en_cours"   → agent joined, conversation is active
// "fermee"     → agent closed the conversation
export default function StatusBadge({ status }) {
  // Map each status to a display label and a color
  const config = {
    en_attente: {
      label: "En attente",
      color: COLORS.warning,
    },
    en_cours: {
      label: "En cours",
      color: COLORS.success,
    },
    fermee: {
      label: "Fermée",
      color: COLORS.textSecondary,
    },
  };

  const current = config[status];

  return (
    <View style={styles.badge}>
      <View
        style={[
          styles.dot,
          { backgroundColor: current.color },
        ]}
      />
      <Text style={styles.text}>{current.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  text: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
});