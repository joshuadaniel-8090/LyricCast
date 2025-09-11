import type { NextApiRequest } from "next";
import type { NextApiResponseServerIO } from "@/types/next";
import { Server as IOServer } from "socket.io";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    console.log("🔌 Initializing new Socket.IO server...");

    const io = new IOServer(res.socket.server, {
      path: "/api/socketio",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("🔌 Client connected:", socket.id);

      let roomId: string | null = null;

      // Join a specific room
      socket.on("join-room", ({ room }) => {
        if (room) {
          roomId = room;
          socket.join(room);
          console.log(`📌 Client ${socket.id} joined room: ${roomId}`);
        }
      });

      socket.on("disconnect", (reason) => {
        console.log(`❌ Client disconnected: ${socket.id}, reason: ${reason}`);
      });

      // Forward events to the room only
      socket.on("slide-update", (data) => {
        if (roomId) {
          socket.to(roomId).emit("slide-update", data);
        }
      });

      socket.on("remote-command", (data) => {
        if (roomId) {
          socket.to(roomId).emit("remote-command", data);
          console.log(`📤 Command sent to room ${roomId}:`, data);
        }
      });

      socket.on("blank-toggle", (value) => {
        if (roomId) socket.to(roomId).emit("blank-toggle", value);
      });

      socket.on("logo-toggle", (value) => {
        if (roomId) socket.to(roomId).emit("logo-toggle", value);
      });

      socket.on("timer-toggle", (value) => {
        if (roomId) socket.to(roomId).emit("timer-toggle", value);
      });
    });
  }

  res.end(); // ✅ works now because we extended NextApiResponse
}
