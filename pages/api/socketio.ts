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

      socket.on("disconnect", (reason) => {
        console.log(`❌ Client disconnected: ${socket.id}, reason: ${reason}`);
      });

      socket.on("slide-update", (data) => {
        socket.broadcast.emit("slide-update", data);
      });

      socket.on("blank-toggle", (value) => {
        socket.broadcast.emit("blank-toggle", value);
      });

      socket.on("logo-toggle", (value) => {
        socket.broadcast.emit("logo-toggle", value);
      });

      socket.on("timer-toggle", (value) => {
        socket.broadcast.emit("timer-toggle", value);
      });
    });
  }

  res.end(); // ✅ works now because we extended NextApiResponse
}
