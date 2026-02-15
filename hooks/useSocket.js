"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

export function useSocket() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL);

    socketInstance.on("connect", () => {
      console.log("✅ Connected to Socket.io server");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Disconnected from Socket.io server");
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, isConnected };
}

export function useVoteUpdates(onVoteUpdate) {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("voteUpdate", onVoteUpdate);

    return () => {
      socket.off("voteUpdate", onVoteUpdate);
    };
  }, [socket, onVoteUpdate]);

  return { isConnected };
}

export function useAllVoters(onAllVoters) {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("allVoters", onAllVoters);

    return () => {
      socket.off("allVoters", onAllVoters);
    };
  }, [socket, onAllVoters]);

  return { isConnected };
}
