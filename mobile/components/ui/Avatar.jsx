import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { COLORS } from "../../constants/colors";

export default function Avatar({ name = "User", uri, size = 42 }) {
  // Extract initials (e.g. "John Doe" -> "JD")
  const initials = name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("") || "U";

  const dynamicStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.avatarImage, dynamicStyle]}
      />
    );
  }

  return (
    <View style={[styles.avatarPlaceholder, dynamicStyle]}>
      <Text style={[styles.initialsText, { fontSize: size * 0.38 }]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarPlaceholder: {
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    backgroundColor: COLORS.border,
  },
  initialsText: {
    color: COLORS.white,
    fontWeight: "700",
  },
});