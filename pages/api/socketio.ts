// pages/api/socketio.ts
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: any) {
  if (!res.socket.server.io) {
    console.log("✅ Initializing Socket.IO server...");

    const httpServer: NetServer = res.socket.server as any;

    const io = new ServerIO(httpServer, {
      path: "/api/socketio",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("🔌 Client connected:", socket.id);

      socket.on("remote-command", (command) => {
        socket.broadcast.emit("remote-command", command);
      });

      socket.on("slide-update", (slideData) => {
        socket.broadcast.emit("slide-update", slideData);
      });

      socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
      });
    });
  }

  res.end();
}
