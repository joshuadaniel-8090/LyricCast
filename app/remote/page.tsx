"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Square, Crown, Timer } from "lucide-react";

let socket: Socket | null = null;

export default function RemoteControlPage() {
  const [isConnected, setIsConnected] = useState(false);

  // --- Socket.io setup ---
  useEffect(() => {
    if (!socket) {
      socket = io("/", { path: "/api/socketio" });

      socket.on("connect", () => {
        console.log("📱 Remote connected:", socket?.id);
        setIsConnected(true);
      });

      socket.on("disconnect", () => {
        console.log("📴 Remote disconnected");
        setIsConnected(false);
      });
    }

    return () => {
      socket?.off("connect");
      socket?.off("disconnect");
    };
  }, []);

  // --- Emit remote commands ---
  const sendCommand = (command: string) => {
    if (socket && socket.connected) {
      socket.emit("remote-command", { command });
      console.log("📤 Sent command:", command);
    } else {
      console.warn("⚠️ Not connected, command not sent:", command);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gray-900 text-white p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header with connection status */}
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold">Remote Control</h1>
        <span
          className={`w-3 h-3 rounded-full ${
            isConnected ? "bg-green-400" : "bg-red-500"
          }`}
          title={isConnected ? "Connected" : "Disconnected"}
        />
      </div>

      {/* Control buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          size="lg"
          variant="ghost"
          onClick={() => sendCommand("prev")}
          className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-white"
        >
          <ChevronLeft size={24} />
        </Button>

        <Button
          size="lg"
          variant="ghost"
          onClick={() => sendCommand("blank")}
          className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-red-400"
        >
          <Square size={22} />
        </Button>

        <Button
          size="lg"
          variant="ghost"
          onClick={() => sendCommand("logo")}
          className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-yellow-400"
        >
          <Crown size={22} />
        </Button>

        <Button
          size="lg"
          variant="ghost"
          onClick={() => sendCommand("timer")}
          className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-blue-400"
        >
          <Timer size={22} />
        </Button>

        <Button
          size="lg"
          variant="ghost"
          onClick={() => sendCommand("next")}
          className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-white"
        >
          <ChevronRight size={24} />
        </Button>
      </div>
    </motion.div>
  );
}
