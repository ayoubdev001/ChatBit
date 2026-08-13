import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="conversations" />
      <Stack.Screen name="new-conversation" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="chat/[id]" />
    </Stack>
  );
}