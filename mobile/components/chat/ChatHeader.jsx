import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { COLORS } from "../../constants/colors";

// name — the agent or support name shown in the header
// online — whether to show the green dot and "En ligne" status
// conversation / currentUser — used to decide whether the "close" action is shown
// onClosePress — called when the agent taps the close button
// isClosing — shows a spinner on the close button while the request is in flight
export default function ChatHeader({
  name = "Support Souq Express",
  online = true,
  conversation,
  currentUser,
  onClosePress,
  isClosing = false,
}) {
  const isClosed = conversation?.status === "fermee";
  const canClose = currentUser?.role === "agent" && conversation && !isClosed;

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backIcon}>‹</Text>
      </Pressable>

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>S</Text>

        {online && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>

        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: online
                  ? COLORS.success
                  : COLORS.textSecondary,
              },
            ]}
          />

          <Text style={styles.status}>
            {online ? "En ligne" : "Hors ligne"}
          </Text>
        </View>
      </View>

      {canClose && (
        <Pressable
          style={styles.closeButton}
          onPress={onClosePress}
          disabled={isClosing}
          accessibilityRole="button"
          accessibilityLabel="Clôturer la conversation"
        >
          {isClosing ? (
            <ActivityIndicator size="small" color={COLORS.danger} />
          ) : (
            <Text style={styles.closeButtonText}>Fermer</Text>
          )}
        </Pressable>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  backButton: {
    width: 36,
    height: 40,
    justifyContent: "center",
  },

  backIcon: {
    fontSize: 32,
    color: COLORS.text,
    marginTop: -4,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginRight: 10,
  },

  avatarText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "800",
  },

  onlineDot: {
    position: "absolute",
    right: -1,
    bottom: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  info: {
    flex: 1,
  },

  closeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor:"#ff0000"
  },

  closeButtonText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },

  name: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "800",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },

  status: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },
});
