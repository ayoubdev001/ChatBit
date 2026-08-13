import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import ConversationCard from "../../components/conversations/ConversationCard";
import { COLORS } from "../../constants/colors";

const conversations = [
  {
    id: "1",
    subject: "Problème avec ma commande",
    message: "Bonjour, j'ai reçu ma commande...",
    time: "10:42",
    status: "en_cours" as const,
  },
  {
    id: "2",
    subject: "Question sur la livraison",
    message: "Je voudrais savoir où est mon colis.",
    time: "09:18",
    status: "en_attente" as const,
  },
  {
    id: "3",
    subject: "Demande de remboursement",
    message: "Je souhaite effectuer un remboursement.",
    time: "Hier",
    status: "fermee" as const,
  },
];

export default function HomeScreen() {
  const openConversation = (id: string) => {
    router.push(`/chat/${id}`);
  };

  const createConversation = () => {
    router.push("/new-conversation");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.smallTitle}>
              Bonjour 👋
            </Text>

            <Text style={styles.title}>
              Ikram
            </Text>
          </View>

          <Pressable
            style={styles.profileButton}
            onPress={() => router.push("/profile")}
          >
            <Text style={styles.profileText}>I</Text>
          </Pressable>
        </View>

        <View style={styles.welcomeCard}>
          <View style={styles.welcomeIcon}>
            <Text style={styles.headset}>◉</Text>
          </View>

          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>
              Comment pouvons-nous vous aider ?
            </Text>

            <Text style={styles.welcomeText}>
              Notre équipe est là pour vous accompagner.
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>ACTIVES</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>ATTENTE</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>48</Text>
            <Text style={styles.statLabel}>FERMÉES</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Conversations récentes
          </Text>

          <Pressable
            onPress={() => console.log("Voir tout")}
          >
            <Text style={styles.seeAll}>
              Voir tout
            </Text>
          </Pressable>
        </View>

        {conversations.map((conversation) => (
          <ConversationCard
            key={conversation.id}
            subject={conversation.subject}
            message={conversation.message}
            time={conversation.time}
            status={conversation.status}
            onPress={() =>
              openConversation(conversation.id)
            }
          />
        ))}

        <Pressable
          style={({ pressed }) => [
            styles.newConversationButton,
            pressed && styles.pressed,
          ]}
          onPress={createConversation}
        >
          <Text style={styles.plus}>+</Text>

          <View>
            <Text style={styles.newTitle}>
              Nouvelle conversation
            </Text>

            <Text style={styles.newSubtitle}>
              Besoin d'aide ? Commencez ici.
            </Text>
          </View>
        </Pressable>
      </ScrollView>

    
      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem}>
          <Text style={[styles.navIcon, styles.active]}>
            ●
          </Text>
          <Text style={[styles.navText, styles.active]}>
            Accueil
          </Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={createConversation}
        >
          <Text style={styles.navIcon}>＋</Text>
          <Text style={styles.navText}>
            Nouveau
          </Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.navIcon}>●</Text>
          <Text style={styles.navText}>
            Profil
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 110,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  smallTitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 2,
  },

  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  profileText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "800",
  },

  welcomeCard: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
  },

  welcomeIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  headset: {
    color: COLORS.white,
    fontSize: 22,
  },

  welcomeContent: {
    flex: 1,
  },

  welcomeTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 21,
  },

  welcomeText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    marginTop: 5,
    lineHeight: 16,
  },

  statsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },

  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  statNumber: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: "800",
  },

  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 8,
    fontWeight: "700",
    marginTop: 3,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "800",
  },

  seeAll: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
  },

  newConversationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 15,
    marginTop: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  plus: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 27,
    fontWeight: "300",
    marginRight: 12,
  },

  newTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "800",
  },

  newSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 3,
  },

  pressed: {
    opacity: 0.75,
  },

  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 78,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 8,
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 70,
  },

  navIcon: {
    color: COLORS.textSecondary,
    fontSize: 17,
    marginBottom: 4,
  },

  navText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "600",
  },

  active: {
    color: COLORS.primary,
  },
});