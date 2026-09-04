import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { COLORS } from "../../constants/colors";

// label    — text shown above the input
// error    — red error message shown below the input
// rightIcon — any element rendered on the right side of the input (e.g. show/hide button)
// ...props — all other TextInput props passed through directly
export default function Input({ label, error, rightIcon, ...props }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {/* Wrap input and icon in a row */}
      <View style={[styles.inputRow, error && styles.inputError]}>
        <TextInput
          {...props}
          style={styles.input}
          placeholderTextColor={COLORS.textSecondary}
        />

        {/* Render the icon only if provided */}
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 5,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
  },

  // The border is now on the row, not the TextInput
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },

  inputError: {
    borderColor: COLORS.danger,
  },

  iconContainer: {
    paddingLeft: 8,
  },

  error: {
    color: COLORS.danger,
    fontSize: 11,
    marginTop: 5,
    marginLeft: 5,
  },
});
