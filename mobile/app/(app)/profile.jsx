import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Pressable
} from "react-native";
import Button from "../../components/ui/Button";
import Avatar from "../../components/ui/Avatar";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { router } from "expo-router";

export default function ProfileScreen() {
  const { user, logout, loading } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

      {/* back button */}
       <Pressable
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backIcon}> ‹ </Text>
            </Pressable>

        {/* Header Avatar Section */}
        <View style={styles.header}>
          <Avatar name={user?.fullname || "User"} size={80} />
          <Text style={styles.name}>{user?.fullname || "Nom Non Disponible"}</Text>
          <Text style={styles.email}>{user?.email || "email@example.com"}</Text>
          
          <View
            style={[
              styles.badge,
              user?.role === "agent" ? styles.agentBadge : styles.clientBadge,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                user?.role === "agent"
                  ? styles.agentBadgeText
                  : styles.clientBadgeText,
              ]}
            >
              {user?.role === "agent" ? "Agent" : "Client"}
            </Text>
          </View>
        </View>

        {/* User Info Details */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nom complet</Text>
            <Text style={styles.infoValue}>{user?.fullname || "-"}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Adresse email</Text>
            <Text style={styles.infoValue}>{user?.email || "-"}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Rôle</Text>
            <Text style={styles.infoValue}>
              {user?.role === "agent" ? "Agent" : "Client"}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Se déconnecter"
            onPress={logout}
            loading={loading}
            variant="danger"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
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
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 12,
  },
  email: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  badge: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  clientBadge: {
    backgroundColor: "#E3F2FD",
  },
  agentBadge: {
    backgroundColor: "#E8F5E9",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  clientBadgeText: {
    color: "#1976D2",
  },
  agentBadgeText: {
    color: "#2E7D32",
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: 16,
    textTransform: "uppercase",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  actions: {
    marginTop: 8,
  },
});