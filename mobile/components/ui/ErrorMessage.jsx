import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { COLORS } from "../../constants/colors";

export default function ErrorMessage({
  message = "Something went wrong. Please try again.",
  onRetry,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>⚠️</Text>
      </View>

      <Text style={styles.title}>Error</Text>
      <Text style={styles.message}>{message}</Text>

      {onRetry && (
        <Pressable style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 40,
    backgroundColor: COLORS.background,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  icon: {
    fontSize: 26,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 6,
  },
  message: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },
});