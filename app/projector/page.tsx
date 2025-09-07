"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Crown, Square, Timer } from "lucide-react";

export default function ProjectorPage() {
  const { currentSlide, showBlank, showLogo, showTimer } = useAppStore();

  const [countdown, setCountdown] = useState<{
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (currentSlide?.type === "countdown" && currentSlide.countdown) {
      setCountdown(currentSlide.countdown);
    }
  }, [currentSlide]);

  useEffect(() => {
    if (!countdown) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (!prev) return null;

        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          return null;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

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
      if (event.key === "Escape") {
        if (document.fullscreenElement) {
          document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const getSlideContent = () => {
    if (showBlank) {
      return (
        <motion.div
          key="blank"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full bg-black flex items-center justify-center"
        >
          <Square size={64} className="text-gray-800 opacity-20" />
        </motion.div>
      );
    }

    if (showLogo) {
      return (
        <motion.div
          key="logo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full bg-black flex items-center justify-center"
        >
          <div className="text-center">
            <Crown size={120} className="text-yellow-400 mx-auto mb-8" />
            <p className="text-4xl font-bold text-white">Church Name</p>
          </div>
        </motion.div>
      );
    }

    if (!currentSlide) {
      return (
        <motion.div
          key="no-slide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full bg-black flex items-center justify-center"
        >
          <p className="text-white text-2xl opacity-50">No slide selected</p>
        </motion.div>
      );
    }

    if (currentSlide.type === "image" && currentSlide.imageUrl) {
      return (
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full h-full bg-black flex items-center justify-center"
        >
          <img
            src={currentSlide.imageUrl}
            alt="Slide content"
            className="max-w-full max-h-full object-contain"
          />
        </motion.div>
      );
    }

    if (currentSlide.type === "video" && currentSlide.videoUrl) {
      return (
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full bg-black"
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
    }

    if (currentSlide.type === "countdown") {
      return (
        <motion.div
          key="countdown"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full bg-black flex items-center justify-center"
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
    }

    // Text slide
    return (
      <motion.div
        key={currentSlide.id}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full h-full bg-black flex items-center justify-center p-16"
      >
        <div className="text-center max-w-6xl">
          <motion.div
            className="text-white text-6xl leading-relaxed font-light whitespace-pre-wrap"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {currentSlide.content}
          </motion.div>
        </div>
      </motion.div>
    );
  };

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

      {showTimer && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed top-8 right-8 bg-black/50 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-3"
        >
          <div className="flex items-center gap-3">
            <Timer size={20} className="text-blue-400" />
            <p className="text-white text-xl font-mono">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
