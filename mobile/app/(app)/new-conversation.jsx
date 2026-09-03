import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";

import Button from "../../components/ui/Button";
import { COLORS } from "../../constants/colors";

import api from "../../api/axios";

export default function NewConversationScreen() {
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateConversation = async () => {
  if (!subject.trim()) {
    return;
  }

  try {
    setLoading(true);
    const response = await api.post("/conversations", { subject });
    router.push(`/(app)/chat/${response.data.id}`);
  } catch (error) {
    console.error(error.response?.data?.error || error.message);
  } finally {
    setLoading(false);
  }
};

  const goBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "android" ? "padding" : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={goBack}
          >
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>

          <Text style={styles.headerTitle}>
            New conversation
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.illustrationContainer}>
          <View style={styles.illustration}>
            <Text style={styles.illustrationIcon}>
              ?
            </Text>
          </View>
        </View>

        <Text style={styles.title}>
          How can we{"\n"}help you?
        </Text>

        <Text style={styles.description}>
          Briefly describe your issue or
          question. An agent will respond as soon as possible.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>
            Subject of your request
          </Text>

          <TextInput
            value={subject}
            onChangeText={setSubject}
            placeholder="e.g. Issue with my order"
            placeholderTextColor={COLORS.textSecondary}
            style={styles.input}
            maxLength={100}
          />

          <View style={styles.counterContainer}>
            <Text style={styles.helperText}>
              Be specific to help us assist you better.
            </Text>

            <Text style={styles.counter}>
              {subject.length}/100
            </Text>
          </View>
        </View>

        <Button
          title="Start conversation →"
          onPress={handleCreateConversation}
          loading={loading}
          disabled={!subject.trim()}
        />

        <Pressable
          style={styles.cancelButton}
          onPress={goBack}
        >
          <Text style={styles.cancelText}>
            Cancel
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 52,
    paddingBottom: 35,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 35,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  backIcon: {
    color: COLORS.text,
    fontSize: 30,
    lineHeight: 30,
    marginTop: -3,
  },

  headerTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
  },

  headerSpacer: {
    width: 42,
  },

  illustrationContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  illustration: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  illustrationIcon: {
    color: COLORS.white,
    fontSize: 34,
    fontWeight: "800",
  },

  title: {
    color: COLORS.text,
    textAlign: "center",
    fontSize: 25,
    lineHeight: 32,
    fontWeight: "800",
  },

  description: {
    color: COLORS.textSecondary,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 10,
    marginBottom: 30,
    paddingHorizontal: 12,
  },

  form: {
    marginBottom: 20,
  },

  label: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },

  input: {
    width: "100%",
    minHeight: 120,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 15,
    color: COLORS.text,
    fontSize: 13,
    textAlignVertical: "top",
  },

  counterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 7,
  },

  helperText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 9,
    lineHeight: 14,
    marginRight: 10,
  },

  counter: {
    color: COLORS.textSecondary,
    fontSize: 9,
  },

  cancelButton: {
    alignItems: "center",
    marginTop: 17,
    paddingVertical: 10,
  },

  cancelText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
});