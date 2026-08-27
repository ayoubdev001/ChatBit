import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable
} from "react-native";
import { router } from "expo-router";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  // --- Form State ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // controls whether the password is visible or hidden
  const [showPassword, setShowPassword] = useState(false);
  // --- Local Loading State ---
  // Keeps the login screen mounted and shows loading spinner inside the button
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  //  Auth Context Hooks
  const { login, error: contextError } = useAuth();

  // --- Handlers ---
  const handleLogin = async () => {
    // Basic field validation before submission
    if (!email.trim() || !password.trim()) {
      setLocalError("Please fill in both email and password.");
      return;
    }

    try {
      setLocalError("");
      setIsSubmitting(true); // Start local button loading spinner

      await login({ email, password });
      // Redirect is handled automatically by RootLayout once token is saved
    } catch (err) {
      setLocalError(
        err?.response?.data?.message ||
          "Failed to log in. Please check your credentials.",
      );
    } finally {
      setIsSubmitting(false); // Stop local button loading spinner
    }
  };

  const handleRegister = () => {
    router.push("/(auth)/register");
  };

  // Determine active error message (local validation or server context)
  const displayError = localError || contextError;

  return (
    // KeyboardAvoidingView ensures the view adjusts when the keyboard pops up.
    // iOS works best with "padding", Android works best with "height" or relying on window inset handling.
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "android" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "android" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        // Allows scrolling when keyboard is open and dismisses keyboard when tapping outside inputs
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>▰</Text>
          </View>
        </View>

        {/* Header / Branding */}
        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.brand}>ChatBit</Text>
        <Text style={styles.subtitle}>Your support, simple and instant.</Text>

        {/* Form Inputs */}
        <View style={styles.form}>
          {/* Display Errors */}
          {displayError ? (
            <Text style={styles.error}>{displayError}</Text>
          ) : null}

          <Input
            label="Email Address"
            placeholder="example@domain.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.inputSpacing}>
            <Input
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              rightIcon={
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Text style={{ color: COLORS.textSecondary, fontSize: 13 }}>
                    {showPassword ? "hide " : "show "}
                  </Text>
                </Pressable>
              }
            />
          </View>

          {/* Login Button with direct spinner */}
          <Button
            title="Sign In "
            onPress={handleLogin}
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        </View>

        {/* Navigation to Register */}
        <Button
          title="Create an account"
          variant="outline"
          onPress={handleRegister}
          disabled={isSubmitting}
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

  inputSpacing: {
    marginTop: 12,
  },

  error: {
    color: "#e53935",
    fontSize: 12,
    marginTop: 8,
    marginBottom: 12,
    textAlign: "center",
  },
});
