
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/colors";

// name — the display name shown above the typing dots
// defaults to "Agent" if not provided
export default function TypingIndicator({ name = "Agent" }) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>S</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>
          {name} is typing
        </Text>

        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  avatarText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "800",
  },

  content: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  name: {
    color: COLORS.textSecondary,
    fontSize: 9,
    marginBottom: 4,
  },

  dots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
});