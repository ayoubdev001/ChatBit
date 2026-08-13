import React, { useEffect, useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { COLORS } from "../../constants/colors";

import {
  getAgents,
  createConversation,
  Agent,
} from "../../services/conversation.service";

export default function NewConversationScreen() {
  const [subject, setSubject] = useState("");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] =
    useState<number | null>(null);

  const [loadingAgents, setLoadingAgents] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoadingAgents(true);

      const data = await getAgents();

      setAgents(data);

      if (data.length > 0) {
        setSelectedAgent(data[0].id);
      }
    } catch (error) {
      console.log("Agents error:", error);

      Alert.alert(
        "Erreur",
        "Impossible de charger les agents."
      );
    } finally {
      setLoadingAgents(false);
    }
  };

  const handleCreateConversation =
    async () => {
      if (!subject.trim()) {
        Alert.alert(
          "Sujet requis",
          "Veuillez saisir le sujet de votre demande."
        );
        return;
      }

      if (!selectedAgent) {
        Alert.alert(
          "Agent requis",
          "Aucun agent disponible."
        );
        return;
      }

      try {
        setLoading(true);

        const conversation =
          await createConversation({
            subject: subject.trim(),
            agentId: selectedAgent,
          });

        console.log(
          "Conversation created:",
          conversation
        );

        router.replace(
          `/chat/${conversation.id}`
        );
      } catch (error: any) {
        console.log(
          "Create conversation error:",
          error?.response?.data
        );

        Alert.alert(
          "Erreur",
          error?.response?.data?.error ||
            "Impossible de créer la conversation."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backIcon}>
              ‹
            </Text>
          </Pressable>

          <Text style={styles.headerTitle}>
            Nouvelle conversation
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
          Comment pouvons-nous{"\n"}
          vous aider ?
        </Text>

        <Text style={styles.description}>
          Décrivez brièvement votre problème ou
          votre question.
        </Text>

        <View style={styles.form}>
          <Input
            label="Sujet de votre demande"
            placeholder="Ex : Problème avec ma commande"
            value={subject}
            onChangeText={setSubject}
            multiline
            numberOfLines={4}
            maxLength={100}
            textAlignVertical="top"
            style={styles.subjectInput}
          />
        </View>

        <Text style={styles.agentTitle}>
          Agent disponible
        </Text>

        {loadingAgents ? (
          <Text style={styles.loadingText}>
            Chargement des agents...
          </Text>
        ) : agents.length === 0 ? (
          <Text style={styles.emptyText}>
            Aucun agent disponible.
          </Text>
        ) : (
          agents.map((agent) => {
            const selected =
              selectedAgent === agent.id;

            return (
              <Pressable
                key={agent.id}
                onPress={() =>
                  setSelectedAgent(agent.id)
                }
                style={[
                  styles.agentCard,
                  selected &&
                    styles.agentCardSelected,
                ]}
              >
                <View
                  style={[
                    styles.agentAvatar,
                    selected &&
                      styles.agentAvatarSelected,
                  ]}
                >
                  <Text
                    style={
                      styles.agentAvatarText
                    }
                  >
                    {agent.fullname
                      .charAt(0)
                      .toUpperCase()}
                  </Text>
                </View>

                <View
                  style={styles.agentInfo}
                >
                  <Text
                    style={styles.agentName}
                  >
                    {agent.fullname}
                  </Text>

                  <Text
                    style={styles.agentEmail}
                  >
                    {agent.email}
                  </Text>
                </View>

                <View
                  style={[
                    styles.radio,
                    selected &&
                      styles.radioSelected,
                  ]}
                >
                  {selected && (
                    <View
                      style={
                        styles.radioInner
                      }
                    />
                  )}
                </View>
              </Pressable>
            );
          })
        )}

        <Button
          title="Démarrer la conversation →"
          onPress={
            handleCreateConversation
          }
          loading={loading}
          disabled={
            !subject.trim() ||
            !selectedAgent ||
            loadingAgents
          }
        />

        <Pressable
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>
            Annuler
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
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
    justifyContent:
      "space-between",
    marginBottom: 30,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor:
      COLORS.white,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  backIcon: {
    color: COLORS.text,
    fontSize: 30,
    lineHeight: 30,
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
    marginBottom: 18,
  },

  illustration: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor:
      COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  illustrationIcon: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: "800",
  },

  title: {
    color: COLORS.text,
    textAlign: "center",
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "800",
  },

  description: {
    color: COLORS.textSecondary,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
    marginBottom: 25,
  },

  form: {
    marginBottom: 5,
  },

  subjectInput: {
    minHeight: 120,
    paddingTop: 15,
    textAlignVertical: "top",
  },

  agentTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 10,
  },

  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 20,
  },

  emptyText: {
    color: COLORS.danger,
    fontSize: 12,
    marginBottom: 20,
  },

  agentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:
      COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    padding: 12,
    marginBottom: 10,
  },

  agentCardSelected: {
    borderColor:
      COLORS.primary,
    borderWidth: 2,
  },

  agentAvatar: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor:
      COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  agentAvatarSelected: {
    backgroundColor:
      COLORS.primary,
  },

  agentAvatarText: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: "800",
  },

  agentInfo: {
    flex: 1,
  },

  agentName: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "800",
  },

  agentEmail: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 3,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor:
      COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  radioSelected: {
    borderColor:
      COLORS.primary,
  },

  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor:
      COLORS.primary,
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