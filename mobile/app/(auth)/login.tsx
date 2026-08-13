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
import { login } from "../../services/auth.service";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        "Champs requis",
        "Veuillez remplir votre email et votre mot de passe."
      );
      return;
    }

    try {
      setLoading(true);

      const result = await login({
        email: email.trim(),
        password,
      });

      console.log("Login success:", result.user);

      Alert.alert(
        "Bienvenue 👋",
        `Bonjour ${result.user.fullname}`,
        [
          {
            text: "Continuer",
            onPress: () => {
              router.replace("/(app)");
            },
          },
        ]
      );
    } catch (error: any) {
      console.log(
        "Login error:",
        error?.response?.data
      );

      const message =
        error?.response?.data?.error ||
        "Email ou mot de passe incorrect.";

      Alert.alert("Connexion échouée", message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.push("/(auth)/register");
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
          Bienvenue sur
        </Text>

        <Text style={styles.brand}>
          ChatBit
        </Text>

        <Text style={styles.subtitle}>
          Votre assistance, simple et instantanée.
        </Text>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Adresse e-mail"
            placeholder="ikram@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View>
            <Input
              label="Mot de passe"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Pressable
              style={styles.forgotPassword}
              onPress={() =>
                Alert.alert(
                  "Mot de passe oublié",
                  "Cette fonctionnalité sera disponible prochainement."
                )
              }
            >
              <Text style={styles.forgotText}>
                Mot de passe oublié ?
              </Text>
            </Pressable>
          </View>

          <Button
            title={
              loading
                ? "Connexion..."
                : "Se connecter →"
            }
            onPress={handleLogin}
            loading={loading}
          />
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />

          <Text style={styles.or}>
            ou
          </Text>

          <View style={styles.divider} />
        </View>

        {/* Register */}
        <Button
          title="Créer un compte"
          variant="outline"
          onPress={handleRegister}
        />

        {/* Footer */}
        <Text style={styles.footer}>
          En vous connectant, vous acceptez nos{" "}
          <Text style={styles.link}>
            Conditions d'utilisation
          </Text>
          {" "}et notre{" "}
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
    marginBottom: 18,
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

  brand: {
    textAlign: "center",
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 2,
  },

  subtitle: {
    textAlign: "center",
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 8,
    marginBottom: 32,
  },

  form: {
    width: "100%",
  },

  forgotPassword: {
    position: "absolute",
    right: 5,
    top: 0,
  },

  forgotText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "600",
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 22,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },

  or: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginHorizontal: 14,
  },

  footer: {
    textAlign: "center",
    color: COLORS.textSecondary,
    fontSize: 9,
    lineHeight: 15,
    marginTop: 24,
    paddingHorizontal: 15,
  },

  link: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});