import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { COLORS } from "../constants/colors";

function RootLayoutNav() {
  const { user, initialLoading } = useAuth();

  // Only true during the boot session check — never during login
  if (initialLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const isAuthenticated = !!user;

  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      {/* Only accessible when NOT logged in */}
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      {/* Only accessible when logged in */}
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </QueryClientProvider>
  );
}