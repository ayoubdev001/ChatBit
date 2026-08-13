import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    await login({ email, password });
  };

  const handleRegister = () => {
    router.push("/(auth)/register");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>▰</Text>
          </View>
        </View>

        {/* header */}
        <Text style={styles.title}>Bienvenue sur</Text>

        <Text style={styles.brand}>ChatBit</Text>

        <Text style={styles.subtitle}>
          Votre assistance, simple et instantanée.
        </Text>

        {/* form */}
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
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <Button
            title="Se connecter →"
            onPress={handleLogin}
            loading={loading}
          />
        </View>

        {/* Register */}
        <Button
          title="Créer un compte"
          variant="outline"
          onPress={handleRegister}
        />
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

  error: {
    color: "#e53935",
    fontSize: 12,
    marginBottom: 12,
    textAlign: "center",
  },
});