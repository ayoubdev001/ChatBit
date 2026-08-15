import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import { COLORS } from "../../constants/colors";

// title   — the button label
// onPress — called when the button is tapped
// loading — shows a spinner instead of the title while a request is running
// disabled — blocks press when true (e.g. empty form fields)
// variant — "primary" (filled) or "outline" (white with border)
// style   — optional extra styles passed from the parent
export default function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  style,
}) {
  const isOutline = variant === "outline";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        isOutline ? styles.outlineButton : styles.primaryButton,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        // Show spinner while the request is in flight
        <ActivityIndicator
          size="small"
          color={isOutline ? COLORS.primary : COLORS.white}
        />
      ) : (
        <Text
          style={[
            styles.text,
            isOutline ? styles.outlineText : styles.primaryText,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  primaryButton: {
    backgroundColor: COLORS.primary,
  },

  outlineButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  text: {
    fontSize: 15,
    fontWeight: "700",
  },

  primaryText: {
    color: COLORS.white,
  },

  outlineText: {
    color: COLORS.primary,
  },

  pressed: {
    opacity: 0.8,
  },

  disabled: {
    opacity: 0.5,
  },
});