import React, { useEffect } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import  api  from "../../api/axios";
import { getSocket } from "../../api/socket";
import ConversationCard from "../../components/conversations/ConversationCard";
import EmptyConversations from "../../components/conversations/EmptyConversations";
import Loading from "../../components/ui/Loading";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { COLORS } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";

export default function ConversationsScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch conversations via REST API
  const {
    data: conversations = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await api.get("/conversations");
      return response.data;
    },
  });

  // Listen to real-time status & conversation updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleConversationUpdated = (updatedConv) => {
      queryClient.setQueryData(["conversations"], (old = []) => {
        const exists = old.some((c) => c.id === updatedConv.id);
        if (exists) {
          return old.map((c) => (c.id === updatedConv.id ? updatedConv : c));
        }
        return [updatedConv, ...old];
      });
    };

    socket.on("conversation:updated", handleConversationUpdated);

    return () => {
      socket.off("conversation:updated", handleConversationUpdated);
    };
  }, [queryClient]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <ErrorMessage
        message={error?.response?.data?.error || "Impossible de charger les conversations "}
        onRetry={refetch}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Conversations</Text>
          <Text style={styles.subtitle}>
            {user?.role === "agent"
              ? "Manage support requests "
              : "Your conversations with customer support "}
          </Text>
        </View>
         <Pressable style={styles.profileButton} onPress={() => router.push("/(app)/profile")}>
               <Text style={styles.profileButtonText}>Profile </Text>
               </Pressable>
      </View>

      {/* List */}
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ConversationCard
            conversation={item}
            onPress={() => router.push(`/(app)/chat/${item.id}`)}
            currentUser={user}
          />
        )}
        ListEmptyComponent={<EmptyConversations role={user?.role} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[COLORS.primary]}
          />
        }
      /> 

       {/* Show 'New Ticket' button only for clients */}
        {user?.role === "client" && (
          <Pressable style={styles.newButton} onPress={() => router.push("/(app)/new-conversation")}>
            <Text style={styles.newButtonText}>+ new </Text>
          </Pressable>
        )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  profileButton: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 20, 
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  newButton: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 20,
    position:"absolute",
    bottom: 35,
    right: 20,  
  },
  newButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
});