  import { io } from "socket.io-client";

  const BACKEND_SOCKET_URL = process.env.NEXT_PUBLIC_CHAT_SOCKET || "http://localhost:8080";
  export const socket = io(BACKEND_SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket"],
  });
