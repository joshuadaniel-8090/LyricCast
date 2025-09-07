"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import SlideNavigator from "./SlideNavigator";
import CurrentSlidePreview from "./CurrentSlidePreview";
import NextSlidePreview from "./NextSlidePreview";

export default function ControlPanel() {
  const { goToNextSlide, previousSlide, toggleBlank, toggleLogo, toggleTimer } =
    useAppStore();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          goToNextSlide(); // ✅ updated
          break;
        case "ArrowLeft":
          event.preventDefault();
          previousSlide();
          break;
        case "b":
        case "B":
          event.preventDefault();
          toggleBlank();
          break;
        case "l":
        case "L":
          event.preventDefault();
          toggleLogo();
          break;
        case "t":
        case "T":
          event.preventDefault();
          toggleTimer();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [goToNextSlide, previousSlide, toggleBlank, toggleLogo, toggleTimer]); // ✅ dependency updated

  return (
    <motion.div
      className="h-full grid grid-cols-3 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="col-span-1 h-full overflow-y-auto border-r pr-2">
        <SlideNavigator />
      </div>

      <div className="col-span-1">
        <CurrentSlidePreview />
      </div>

      <div className="col-span-1">
        <NextSlidePreview />
      </div>
    </motion.div>
  );
}
