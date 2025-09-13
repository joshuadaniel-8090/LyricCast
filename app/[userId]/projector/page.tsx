"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Crown, Square, Timer } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useParams } from "next/navigation";

export default function ProjectorPage() {
  const {
    currentSlide,
    currentServicePlan,
    showBlank,
    showLogo,
    setCurrentSlide,
  } = useAppStore();

  const params = useParams();
  const userId = typeof params?.userId === "string" ? params.userId : undefined;

  const [countdown, setCountdown] = useState<{
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [endOfPresentation, setEndOfPresentation] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // --- Socket connection & slide listener ---
  useEffect(() => {
    if (!userId) return;

    if (!socketRef.current) {
      socketRef.current = io("/", {
        path: "/api/socketio",
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      });

      socketRef.current.on("connect", () => {
        console.log("✅ Projector connected:", socketRef.current?.id);
        socketRef.current?.emit("join-room", { room: userId });
      });

      socketRef.current.on("disconnect", (reason) => {
        console.log("⚠️ Projector disconnected:", reason);
      });
    }

    const attachSlideHandler = () => {
      socketRef.current?.off("slide-update");
      socketRef.current?.on("slide-update", (slideData: any) => {
        const incoming = slideData?.currentSlide ?? slideData;
        if (!incoming) return;

        const storeState = useAppStore.getState();
        if (storeState.currentSlide?.id === incoming.id) return;

        setCurrentSlide(incoming);

        const allSlides =
          currentServicePlan?.items.flatMap((item) => item.slides) ?? [];
        const currentIndex = allSlides.findIndex((s) => s.id === incoming.id);
        setEndOfPresentation(currentIndex >= allSlides.length - 1);
      });
    };

    attachSlideHandler();
    socketRef.current?.on("reconnect", attachSlideHandler);

    return () => {
      socketRef.current?.off("slide-update");
      socketRef.current?.off("connect");
      socketRef.current?.off("disconnect");
      socketRef.current?.off("reconnect");
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [setCurrentSlide, userId, currentServicePlan]);

  // --- Countdown logic ---
  useEffect(() => {
    if (currentSlide?.type === "countdown" && currentSlide.countdown) {
      setCountdown(currentSlide.countdown);
    } else {
      setCountdown(null);
    }
  }, [currentSlide]);

  useEffect(() => {
    if (!countdown) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (!prev) return null;
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { minutes: prev.minutes - 1, seconds: 59 };
        return null;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // --- Fullscreen ---
  const enterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (error) {
      console.log("Fullscreen not available:", error);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape" && document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // --- Render Markdown-style headings ---
  const renderMarkdownText = (text: string) => {
    return text.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-4xl font-semibold text-white my-2">
            {trimmed.replace(/^### /, "")}
          </h3>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-5xl font-semibold text-white my-2">
            {trimmed.replace(/^## /, "")}
          </h2>
        );
      }
      if (trimmed.startsWith("# ")) {
        return (
          <h1 key={idx} className="text-6xl font-bold text-white my-2">
            {trimmed.replace(/^# /, "")}
          </h1>
        );
      }
      if (trimmed === "___") {
        return <div key={idx} className="h-10"></div>; // blank line
      }
      return (
        <p key={idx} className="text-5xl text-white my-3">
          {line}
        </p>
      );
    });
  };

  // --- Slide content renderer ---
  const getSlideContent = () => {
    if (endOfPresentation)
      return (
        <motion.div
          key="end"
          className="w-full h-full bg-black flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <p className="text-white text-6xl font-bold text-center">
            End of Presentation
          </p>
        </motion.div>
      );

    if (showBlank)
      return (
        <motion.div
          key="blank"
          className="w-full h-full bg-black flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Square size={64} className="text-gray-800 opacity-20" />
        </motion.div>
      );

    if (showLogo)
      return (
        <motion.div
          key="logo"
          className="w-full h-full bg-black flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="text-center">
            <Crown size={120} className="text-yellow-400 mx-auto mb-8" />
            <p className="text-4xl font-bold text-white">Church Name</p>
          </div>
        </motion.div>
      );

    if (!currentSlide)
      return (
        <motion.div
          key="noslide"
          className="w-full h-full bg-black flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <p className="text-white text-2xl opacity-50">No slide selected</p>
        </motion.div>
      );

    if (currentSlide.type === "image" && currentSlide.imageUrl)
      return (
        <motion.div
          key="image"
          className="w-full h-full bg-black flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
        >
          <img
            src={currentSlide.imageUrl}
            alt="Slide content"
            className="max-w-full max-h-full object-contain"
          />
        </motion.div>
      );

    if (currentSlide.type === "video" && currentSlide.videoUrl)
      return (
        <motion.div
          key="video"
          className="w-full h-full bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <video
            src={currentSlide.videoUrl}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          />
        </motion.div>
      );

    if (currentSlide.type === "countdown")
      return (
        <motion.div
          key="countdown"
          className="w-full h-full bg-black flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="text-center">
            <Timer size={120} className="text-blue-400 mx-auto mb-12" />
            <motion.p
              className="text-9xl font-bold text-white font-mono"
              key={`${countdown?.minutes}-${countdown?.seconds}`}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
            >
              {countdown
                ? `${String(countdown.minutes).padStart(2, "0")}:${String(
                    countdown.seconds
                  ).padStart(2, "0")}`
                : "00:00"}
            </motion.p>
          </div>
        </motion.div>
      );

    // Default: text slide
    return (
      <motion.div
        key={`text-${currentSlide.id}`}
        className="w-full h-full bg-black flex items-center justify-center p-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="text-center max-w-6xl">
          <motion.div
            className="whitespace-pre-wrap leading-relaxed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          >
            {currentSlide.content && renderMarkdownText(currentSlide.content)}
          </motion.div>
        </div>
      </motion.div>
    );
  };

  if (!userId) return <p className="text-red-500">Error: Invalid userId</p>;

  return (
    <div className="w-screen h-screen overflow-hidden bg-black">
      {!isFullscreen && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
          <button
            onClick={enterFullscreen}
            className="px-6 py-3 text-xl bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg"
          >
            Enter Fullscreen
          </button>
        </div>
      )}
      <AnimatePresence mode="wait">{getSlideContent()}</AnimatePresence>
    </div>
  );
}
