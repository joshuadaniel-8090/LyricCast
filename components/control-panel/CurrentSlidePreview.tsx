"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Square,
  Crown,
  Timer,
  Edit3,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  SquareX,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";

export default function CurrentSlidePreview() {
  const router = useRouter();
  const params = useParams();
  const rawUserId = params?.userId;
  const userId = typeof rawUserId === "string" ? rawUserId : undefined;

  const {
    currentSlide,
    currentServicePlan,
    showBlank,
    showLogo,
    showTimer,
    toggleBlank,
    toggleLogo,
    toggleTimer,
    goToNextSlide,
    previousSlide,
    goToSlide,
    setCurrentSlide,
  } = useAppStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [showSlideOverview, setShowSlideOverview] = useState(false);

  const hasSlides =
    currentServicePlan?.items?.some((item) => item.slides?.length > 0) ?? false;

  // --- Editing Handlers ---
  const handleEditStart = () => {
    setEditContent(currentSlide?.content || "");
    setIsEditing(true);
  };

  const handleEditSave = () => {
    if (currentSlide) {
      setCurrentSlide({ ...currentSlide, content: editContent });
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditContent("");
  };

  // --- Keyboard shortcut for Overview ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "g") {
        setShowSlideOverview((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // --- Navigate to Projector Page ---
  const goToProjector = () => {
    if (!userId) return;
    router.push(`/${userId}/projector`);
  };

  return (
    <motion.div
      className="h-full bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Current Slide</h3>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={goToProjector}
            className="text-white hover:bg-white/20"
            disabled={!hasSlides || !currentSlide}
          >
            <Monitor size={14} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleEditStart}
            className="text-white hover:bg-white/20"
            disabled={!hasSlides || !currentSlide}
          >
            <Edit3 size={14} />
          </Button>
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        {!hasSlides ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Square size={48} className="mx-auto mb-4 opacity-50" />
              <p className="font-medium">No songs/slides available</p>
            </div>
          </div>
        ) : !currentSlide ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Monitor size={48} className="mx-auto mb-4 opacity-50" />
              <p className="font-medium">No slide selected</p>
            </div>
          </div>
        ) : (
          <motion.div
            className="flex-1 flex flex-col justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex-1 flex flex-col gap-4">
              <Card className="w-full aspect-video bg-black border-white/20 flex items-center justify-center overflow-hidden">
                {isEditing ? (
                  <div className="w-full h-full p-4 flex flex-col">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="flex-1 bg-transparent border-none text-white resize-none focus:ring-0"
                      placeholder="Edit slide content..."
                    />
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleEditCancel}
                      >
                        <X size={14} className="mr-1" /> Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleEditSave}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save size={14} className="mr-1" /> Save
                      </Button>
                    </div>
                  </div>
                ) : showBlank ? (
                  <div className="text-center">
                    <Square size={48} className="mx-auto mb-4 text-gray-500" />
                    <p className="text-gray-400">Blank Screen</p>
                  </div>
                ) : showLogo ? (
                  <div className="text-center">
                    <Crown size={48} className="mx-auto mb-4 text-yellow-400" />
                    <p className="text-yellow-400">Church Logo</p>
                  </div>
                ) : currentSlide?.type === "image" && currentSlide.imageUrl ? (
                  <img
                    src={currentSlide.imageUrl}
                    alt="Slide content"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : currentSlide?.type === "countdown" &&
                  currentSlide.countdown ? (
                  <div className="text-center">
                    <Timer size={48} className="mx-auto mb-4 text-blue-400" />
                    <p className="text-6xl font-bold text-white">
                      {String(currentSlide.countdown.minutes).padStart(2, "0")}:
                      {String(currentSlide.countdown.seconds).padStart(2, "0")}
                    </p>
                  </div>
                ) : (
                  <div className="text-white text-2xl leading-relaxed whitespace-pre-wrap text-center max-w-full px-4">
                    {currentSlide?.content || ""}
                  </div>
                )}
              </Card>
            </div>
          </motion.div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-4 right-4 flex gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowSlideOverview((prev) => !prev)}
            className={`w-16 h-16 rounded-full ${
              showSlideOverview
                ? "bg-blue-600/20 text-blue-400"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
            disabled={!hasSlides}
          >
            <SquareX size={18} />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={toggleBlank}
            className={`w-16 h-16 rounded-full ${
              showBlank
                ? "bg-red-600/20 text-red-400"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Square size={18} />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={toggleLogo}
            className={`w-16 h-16 rounded-full ${
              showLogo
                ? "bg-yellow-600/20 text-yellow-400"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Crown size={18} />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTimer}
            className={`w-16 h-16 rounded-full ${
              showTimer
                ? "bg-blue-600/20 text-blue-400"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Timer size={18} />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={previousSlide}
            className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-white"
            disabled={!hasSlides || !currentSlide}
          >
            <ChevronLeft size={20} />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={goToNextSlide}
            className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-white"
            disabled={!hasSlides || !currentSlide}
          >
            <ChevronRight size={20} />
          </Button>
        </div>

        {/* Slide Overview */}
        <AnimatePresence>
          {showSlideOverview && hasSlides && currentServicePlan && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/95 z-50 p-8 overflow-auto grid gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              }}
            >
              {currentServicePlan.items
                .flatMap((item) => item.slides)
                .map((slide, index) => (
                  <div
                    key={slide.id}
                    className="bg-black/20 rounded-lg cursor-pointer hover:ring-2 hover:ring-white relative p-2 flex flex-col justify-between"
                    onClick={() => {
                      goToSlide(index);
                      setShowSlideOverview(false);
                    }}
                  >
                    <p className="text-white text-sm truncate">
                      {slide.title || `Slide ${index + 1}`}
                    </p>
                    <div className="text-xs text-gray-300 mt-1 h-28 overflow-hidden whitespace-pre-wrap">
                      {slide.content || "Slide preview"}
                    </div>
                  </div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
