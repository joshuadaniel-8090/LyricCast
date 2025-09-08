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
          goToNextSlide();
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
  }, [goToNextSlide, previousSlide, toggleBlank, toggleLogo, toggleTimer]);

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
