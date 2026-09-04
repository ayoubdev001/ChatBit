import React, { useState } from "react";
import {
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
import { useAuth } from "../../context/AuthContext";

export default function RegisterScreen() {
  // ── Form fields ───────────────────────────────────────────────
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState("client"); // Options: "client" | "agent"

  //show and hide state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  

  // ── Local states ──────────────────────────────────────────────
  // Controls loading spinner inside the register button only
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Client-side validation errors (e.g., password mismatch, empty fields)
  const [localError, setLocalError] = useState(null);

  // ── Auth context ──────────────────────────────────────────────
  const { register, error: serverError } = useAuth();

  // ── Handlers ──────────────────────────────────────────────────
  const handleRegister = async () => {
    // Clear previous error message
    setLocalError(null);

    // Basic Client-side validations
    if (!fullname.trim() || !email.trim() || !password || !confirmPassword) {
      setLocalError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    try {
      // Trigger button spinner locally
      setIsSubmitting(true);

      // Submit registration payload to AuthContext
      await register({ fullname, email, password, role });

      // Upon success, navigation redirect is handled by router or layout
    } catch (err) {
      setLocalError(
        err?.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      // Always stop the button spinner regardless of outcome
      setIsSubmitting(false);
    }
  };

  const displayError = localError || serverError;

  return (
    // KeyboardAvoidingView adjusts layout height dynamically across iOS and Android
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "android" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "android" ? 0 : 20}
    >
      {/* ScrollView enables scrolling so the keyboard never blocks inputs/buttons */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>💬</Text>
          </View>
        </View>

        {/* Header */}
        <Text style={styles.title}>Create Account</Text>

        <Text style={styles.subtitle}>
          Join ChatBit and get instant support
          {"\n"}
          whenever you need it.
        </Text>

        {/* Form Inputs */}
        <View style={styles.form}>
          {/* Validation & Server Error Display */}
          {displayError ? (
            <Text style={styles.error}>{displayError}</Text>
          ) : null}
          

          <Input
            placeholder="Full Name"
            value={fullname}
            onChangeText={setFullname}
            autoCapitalize="words"
          />

          <View style={styles.inputSpacing}>
            <Input
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Role Selection */}
          <View style={styles.inputSpacing}>
            <Text style={styles.label}>Account Type</Text>
            <View style={styles.roleContainer}>
              <Pressable
                style={[
                  styles.roleButton,
                  role === "client" && styles.roleButtonActive,
                ]}
                onPress={() => setRole("client")}
              >
                <Text
                  style={[
                    styles.roleText,
                    role === "client" && styles.roleTextActive,
                  ]}
                >
                  client
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.roleButton,
                  role === "agent" && styles.roleButtonActive,
                ]}
                onPress={() => setRole("agent")}
              >
                <Text
                  style={[
                    styles.roleText,
                    role === "agent" && styles.roleTextActive,
                  ]}
                >
                  agent
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.inputSpacing}>
            <Input
              
              placeholder="Password"
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

          <View style={styles.inputSpacing}>
            <Input
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              rightIcon={
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Text style={{ color: COLORS.textSecondary, fontSize: 13 }}>
                    {showConfirmPassword ? "hide " : "show "}
                  </Text>
                </Pressable>
              }
            />
          </View>

          {/* Button displaying spinner during submit */}
          <View style={styles.buttonSpacing}>
            <Button
              title="Create Account "
              onPress={handleRegister}
              loading={isSubmitting}
              disabled={isSubmitting}
            />
          </View>
        </View>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>

          <Pressable onPress={() => router.replace("/(auth)/login")} disabled={isSubmitting}>
            <Text style={styles.loginLink}>Sign In </Text>
          </Pressable>
        </View>
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

   label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 6,
  },

  roleContainer: {
    flexDirection: "row",
    gap: 20,
  },

  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border || "#e0e0e0",
    alignItems: "center",
    backgroundColor: COLORS.white || "#ffffff",
  },

  roleButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  roleText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  roleTextActive: {
    color: COLORS.white,
  },

  inputSpacing: {
    marginTop: 5,
  },

  buttonSpacing: {
    marginTop: 20,
  },

  error: {
    color: COLORS.danger || "#e53935",
    fontSize: 12,
    marginTop: 10,
    marginBottom: 6,
    textAlign: "center",
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
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 5,
  },
});
