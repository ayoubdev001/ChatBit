import { Conversation, Message, User } from "../models/index.js";

export function registerChatHandlers(io, socket) {
  // These values come from the verified JWT in socket.auth.js.
  const { userId, role } = socket.user;


  // PRESENCE — user connected

  // Mark the user as online in PostgreSQL.
  setUserOnline(userId, true)
    .then(() => {
      // Tell all connected clients that this user is online.
      io.emit("presence:update", {
        userId,
        isOnline: true,
      });
    })
    .catch((err) => {
      console.error("Error setting user online:", err);
    });


  // 1 conversation:join


  socket.on("conversation:join", async (conversationId) => {
    try {
      // Check that a conversation ID was actually provided.
      if (!conversationId) {
        return socket.emit("error", {
          code: "INVALID_CONVERSATION",
          message: "Conversation ID is required",
        });
      }

      // Find the conversation in PostgreSQL.
      const conversation = await Conversation.findByPk(conversationId);

      // Conversation doesn't exist.
      if (!conversation) {
        return socket.emit("error", {
          code: "CONVERSATION_NOT_FOUND",
          message: "Conversation not found",
        });
      }


      // CLIENT AUTHORIZATION
      

      // A client can only join their own conversation.
      if (role === "client" && conversation.clientId !== userId) {
        return socket.emit("error", {
          code: "ACCESS_DENIED",
          message: "You cannot access this conversation",
        });
      }

      
      // AGENT AUTHORIZATION + ASSIGNMENT


      if (role === "agent") {
        // If the conversation is still waiting and has no agent,
        // this agent takes the conversation.
        if (
          conversation.agentId === null &&
          conversation.status === "en_attente"
        ) {
          conversation.agentId = userId;
          conversation.status = "en_cours";

          await conversation.save();

          // Tell everyone already inside the room that the conversation has changed.
          // The new agent hasn't joined the room yet,
          io.to(`conversation:${conversationId}`).emit(
            // so we also send an update directly to them below.
            "conversation:updated",
            {
              conversationId,
              status: "en_cours",
              agentId: userId,
            }
          );
        }

        // If another agent already owns this conversation,reject the new agent.
        if (
          conversation.agentId !== null &&
          conversation.agentId !== userId
        ) {
          return socket.emit("error", {
            code: "CONVERSATION_ASSIGNED",
            message: "This conversation is already handled by another agent",
          });
        }
      }

     
      // JOIN SOCKET.IO ROOM

      const room = `conversation:${conversationId}`;

      socket.join(room);

      console.log(`User ${userId} joined ${room}`);

      // Send the current conversation state to the user who just joined
     
      socket.emit("conversation:updated", {
        conversationId,
        status: conversation.status,
        agentId: conversation.agentId,
      });
    } catch (err) {
      console.error("conversation:join error:", err);

      socket.emit("error", {
        code: "SERVER_ERROR",
        message: "Could not join conversation",
      });
    }
  });


    // conversation:leave


  socket.on("conversation:leave", (conversationId) => {
    if (!conversationId) {
      return;
    }

    const room = `conversation:${conversationId}`;

    // Remove this socket from the conversation room
    socket.leave(room);

    console.log(`User ${userId} left ${room}`);
  });


  // 3 message:send


  socket.on("message:send", async ({ conversationId, content }) => {
    try {
      // Validate the message content
      if (!conversationId || !content?.trim()) {
        return socket.emit("error", {
          code: "INVALID_MESSAGE",
          message: "Conversation ID and message content are required",
        });
      }

      // Find the conversation
      const conversation = await Conversation.findByPk(conversationId);

      if (!conversation) {
        return socket.emit("error", {
          code: "CONVERSATION_NOT_FOUND",
          message: "Conversation not found",
        });
      }


      // 4 CHECK PARTICIPATION
 

      //must be the user who created the conversationand the agent assined
      const isParticipant =
        conversation.clientId === userId ||
        conversation.agentId === userId;

      if (!isParticipant) {
        return socket.emit("error", {
          code: "ACCESS_DENIED",
          message: "You are not part of this conversation",
        });
      }

      // 5 CHECK CONVERSATION STATUS


      // Nobody can send messages after the agent closes it.
      if (conversation.status === "fermee") {
        return socket.emit("error", {
          code: "CONVERSATION_CLOSED",
          message: "This conversation is closed",
        });
      }

    
      // SAVE MESSAGE FIRST
      

      // message saved in Postgres before other clients receive it

      const message = await Message.create({
        conversationId,
        senderId: userId,
        content: content.trim(),
      });


      // 6 BROADCAST NEW MESSAGE


      const room = `conversation:${conversationId}`;

      io.to(room).emit("message:new", {
        id: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        content: message.content,
        createdAt: message.createdAt,
      });
    } catch (err) {
      console.error("message:send error:", err);

      socket.emit("error", {
        code: "SERVER_ERROR",
        message: "Could not send message",
      });
    }
  });


  // typing:start


  socket.on("typing:start", async ({ conversationId }) => {
    try {
      if (!conversationId) {
        return;
      }

      // Make sure the user is actually part of the conversation.
      const conversation = await Conversation.findByPk(conversationId);

      if (!conversation) {
        return socket.emit("error", {
          code: "CONVERSATION_NOT_FOUND",
          message: "Conversation not found",
        });
      }

      const isParticipant =
        conversation.clientId === userId ||
        conversation.agentId === userId;

      if (!isParticipant) {
        return socket.emit("error", {
          code: "ACCESS_DENIED",
          message: "You are not part of this conversation",
        });
      }

      // Send typing information to everyone ELSE in the room.
      // socket.to() excludes the person who is typing.
      socket
        .to(`conversation:${conversationId}`)
        .emit("typing:update", {
          userId,
          conversationId,
          isTyping: true,
        });
    } catch (err) {
      console.error("typing:start error:", err);
    }
  });


  // 7 typing:stop


  socket.on("typing:stop", async ({ conversationId }) => {
    try {
      if (!conversationId) {
        return;
      }

      // Make sure the user is actually part of the conversation.
      const conversation = await Conversation.findByPk(conversationId);

      if (!conversation) {
        return;
      }

      const isParticipant =
        conversation.clientId === userId ||
        conversation.agentId === userId;

      if (!isParticipant) {
        return;
      }

      // Tell the other participant that the user stopped typing.
      socket
        .to(`conversation:${conversationId}`)
        .emit("typing:update", {
          userId,
          conversationId,
          isTyping: false,
        });
    } catch (err) {
      console.error("typing:stop error:", err);
    }
  });


  // 8 DISCONNECT


  socket.on("disconnect", async () => {
    try {
      // Mark the user offline in PostgreSQL.
      await setUserOnline(userId, false);

      // Tell connected clients about the change.
      io.emit("presence:update", {
        userId,
        isOnline: false,
      });

      console.log(`User ${userId} disconnected`);
    } catch (err) {
      console.error("disconnect error:", err);
    }
  });
}


// 9 HELPER — UPDATE USER ONLINE STATUS


async function setUserOnline(userId, isOnline) {
  await User.update(
    { isOnline },
    {
      where: {
        id: userId,
      },
    }
  );
}