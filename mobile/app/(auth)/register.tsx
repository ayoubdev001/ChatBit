import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";

import { router } from "expo-router";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { COLORS } from "../../constants/colors";
import { register } from "../../services/auth.service";

export default function RegisterScreen() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !fullname.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert(
        "Champs requis",
        "Veuillez remplir tous les champs."
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Mot de passe",
        "Le mot de passe doit contenir au moins 6 caractères."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Erreur",
        "Les mots de passe ne correspondent pas."
      );
      return;
    }

    try {
      setLoading(true);

      const user = await register({
        fullname: fullname.trim(),
        email: email.trim(),
        password,
        role: "client",
      });

      console.log(
        "Register success:",
        user
      );

      Alert.alert(
        "Compte créé 🎉",
        "Votre compte a été créé avec succès.",
        [
          {
            text: "Se connecter",
            onPress: () => {
              router.replace("/(auth)/login");
            },
          },
        ]
      );
    } catch (error: any) {
      console.log(
        "Register error:",
        error?.response?.data
      );

      const message =
        error?.response?.data?.error ||
        "Impossible de créer le compte.";

      Alert.alert(
        "Inscription échouée",
        message
      );
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    router.replace("/(auth)/login");
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
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>
              ▰
            </Text>
          </View>
        </View>

        {/* Header */}
        <Text style={styles.title}>
          Créez votre compte
        </Text>

        <Text style={styles.subtitle}>
          Rejoignez ChatBit et obtenez de l'aide
          {"\n"}
          quand vous en avez besoin.
        </Text>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Nom complet"
            placeholder="Votre nom complet"
            value={fullname}
            onChangeText={setFullname}
            autoCapitalize="words"
          />

          <Input
            label="Adresse e-mail"
            placeholder="ikram@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            label="Mot de passe"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Input
            label="Confirmer le mot de passe"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={
              setConfirmPassword
            }
            secureTextEntry
          />

          <Button
            title={
              loading
                ? "Création..."
                : "Créer mon compte →"
            }
            onPress={handleRegister}
            loading={loading}
          />
        </View>

        {/* Login */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Vous avez déjà un compte ?
          </Text>

          <Pressable onPress={goToLogin}>
            <Text style={styles.loginLink}>
              Se connecter
            </Text>
          </Pressable>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          En créant un compte, vous acceptez nos{" "}
          <Text style={styles.link}>
            Conditions d'utilisation
          </Text>{" "}
          et notre{" "}
          <Text style={styles.link}>
            Politique de confidentialité
          </Text>
          .
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 35,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  logo: {
    width: 58,
    height: 58,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  logoIcon: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "900",
  },

  title: {
    textAlign: "center",
    color: COLORS.text,
    fontSize: 25,
    fontWeight: "700",
  },

  subtitle: {
    textAlign: "center",
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 28,
  },

  form: {
    width: "100%",
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },

  loginText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },

  loginLink: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 5,
  },

  footer: {
    textAlign: "center",
    color: COLORS.textSecondary,
    fontSize: 9,
    lineHeight: 15,
    marginTop: 22,
    paddingHorizontal: 10,
  },

  link: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});