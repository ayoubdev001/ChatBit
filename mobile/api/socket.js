import { io } from "socket.io-client";
import { getToken } from "../asyncstorg/storage";

const SOCKET_URL =
  "http://192.168.1.217:3000";

let socket = null;

export async function connectSocket() {
  // If instance exists, ensure connected and return
  if (socket) {
    if (!socket.connected) socket.connect();
    return socket;
  }

  // Create single instance with dynamic auth lookup
  socket = io(SOCKET_URL, {
    auth: async (cb) => {
      const token = await getToken();
      cb({ token: token ? `Bearer ${token}` : "" });
    },
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    transports: ["websocket"],
  });

  // Attach global lifecycle listeners ONCE
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.log("Socket connection error:", err.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  socket.connect();
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}