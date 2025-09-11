"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import SlideNavigator from "@/components/control-panel/SlideNavigator";
import CurrentSlidePreview from "@/components/control-panel/CurrentSlidePreview";
import NextSlidePreview from "@/components/control-panel/NextSlidePreview";
import { io, Socket } from "socket.io-client";

export default function ControlPanel() {
  const {
    goToNextSlide,
    previousSlide,
    toggleBlank,
    toggleLogo,
    toggleTimer,
    showBlank,
    showLogo,
    showTimer,
  } = useAppStore();

  const socketRef = useRef<Socket | null>(null);

  // Connect socket
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("/", {
        path: "/api/socketio",
      });

      socketRef.current.on("connect", () => {
        console.log(
          "✅ ControlPanel connected to Socket.IO:",
          socketRef.current?.id
        );
      });

      socketRef.current.on("disconnect", (reason) => {
        console.log("⚠️ ControlPanel disconnected:", reason);
      });
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Handle keypress
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          goToNextSlide();
          socketRef.current?.emit("slide-update", { currentSlide: "next" });
          break;

        case "ArrowLeft":
          event.preventDefault();
          previousSlide();
          socketRef.current?.emit("slide-update", { currentSlide: "prev" });
          break;

        case "b":
        case "B":
          event.preventDefault();
          toggleBlank();
          socketRef.current?.emit("blank-toggle", !showBlank);
          break;

        case "l":
        case "L":
          event.preventDefault();
          toggleLogo();
          socketRef.current?.emit("logo-toggle", !showLogo);
          break;

        case "t":
        case "T":
          event.preventDefault();
          toggleTimer();
          socketRef.current?.emit("timer-toggle", !showTimer);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    goToNextSlide,
    previousSlide,
    toggleBlank,
    toggleLogo,
    toggleTimer,
    showBlank,
    showLogo,
    showTimer,
  ]);

  return (
    <motion.div
      className="h-[58rem] grid grid-cols-[20rem_3fr_2fr] gap-2 px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Slide Navigator */}
      <div className="h-full overflow-y-auto">
        <SlideNavigator />
      </div>

      {/* Current Slide Preview */}
      <div className="w-full">
        <CurrentSlidePreview />
      </div>

      {/* Next Slide Preview */}
      <div className="w-full">
        <NextSlidePreview />
      </div>
    </motion.div>
  );
}
