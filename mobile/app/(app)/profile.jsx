import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import { COLORS } from "../../constants/colors";

export default function ProfileScreen() {
  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Voulez-vous vraiment vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Déconnexion",
          style: "destructive",
          onPress: () => {
            // Logout الحقيقي غادي نربطوه من بعد
            router.replace("/login");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>

          <Text style={styles.headerTitle}>
            Mon profil
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Profile */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>I</Text>
          </View>

          <Text style={styles.name}>
            Ikram Haddioui
          </Text>

          <Text style={styles.email}>
            ikram@example.com
          </Text>

          <View style={styles.roleBadge}>
            <View style={styles.roleDot} />
            <Text style={styles.roleText}>
              Client
            </Text>
          </View>
        </View>

        {/* Account */}
        <Text style={styles.sectionTitle}>
          Mon compte
        </Text>

        <View style={styles.card}>
          <ProfileItem
            icon="👤"
            label="Nom complet"
            value="Ikram Haddioui"
          />

          <View style={styles.separator} />

          <ProfileItem
            icon="✉"
            label="Email"
            value="ikram@example.com"
          />

          <View style={styles.separator} />

          <ProfileItem
            icon="●"
            label="Rôle"
            value="Client"
          />
        </View>

        {/* Support */}
        <Text style={styles.sectionTitle}>
          Support
        </Text>

        <View style={styles.card}>
          <Pressable style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Text>?</Text>
            </View>

            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>
                Centre d'aide
              </Text>

              <Text style={styles.menuSubtitle}>
                Besoin d'aide ?
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </Pressable>

          <View style={styles.separator} />

          <Pressable style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Text>i</Text>
            </View>

            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>
                À propos
              </Text>

              <Text style={styles.menuSubtitle}>
                ChatBit v1.0.0
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </Pressable>
        </View>

        {/* Logout */}
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.pressed,
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutIcon}>↪</Text>

          <Text style={styles.logoutText}>
            Se déconnecter
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

interface ProfileItemProps {
  icon: string;
  label: string;
  value: string;
}

function ProfileItem({
  icon,
  label,
  value,
}: ProfileItemProps) {
  return (
    <View style={styles.profileItem}>
      <View style={styles.itemIcon}>
        <Text style={styles.itemIconText}>
          {icon}
        </Text>
      </View>

      <View style={styles.itemContent}>
        <Text style={styles.itemLabel}>
          {label}
        </Text>

        <Text style={styles.itemValue}>
          {value}
        </Text>
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
    paddingTop: 52,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
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
    fontSize: 17,
    fontWeight: "800",
  },

  headerSpacer: {
    width: 42,
  },

  profileSection: {
    alignItems: "center",
    marginBottom: 32,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },

  avatarText: {
    color: COLORS.white,
    fontSize: 34,
    fontWeight: "800",
  },

  name: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
  },

  email: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },

  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF7F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },

  roleDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },

  roleText: {
    color: COLORS.success,
    fontSize: 10,
    fontWeight: "700",
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },

  itemIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  itemIconText: {
    fontSize: 14,
  },

  itemContent: {
    flex: 1,
  },

  itemLabel: {
    color: COLORS.textSecondary,
    fontSize: 9,
    marginBottom: 3,
  },

  itemValue: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
  },

  separator: {
    height: 1,
    backgroundColor: COLORS.border,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },

  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  menuContent: {
    flex: 1,
  },

  menuTitle: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
  },

  menuSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 9,
    marginTop: 3,
  },

  arrow: {
    color: COLORS.textSecondary,
    fontSize: 24,
  },

  logoutButton: {
    height: 52,
    borderRadius: 17,
    backgroundColor: "#FDEEEE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },

  logoutIcon: {
    color: "#D95353",
    fontSize: 19,
    marginRight: 8,
  },

  logoutText: {
    color: "#D95353",
    fontSize: 13,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.7,
  },
});