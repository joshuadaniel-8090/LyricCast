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
  const [endOfPresentation, setEndOfPresentation] = useState(false);

  const hasSlides =
    currentServicePlan?.items?.some((item) => item.slides?.length > 0) ?? false;

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "g") {
        setShowSlideOverview((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const goToProjector = () => {
    if (!userId) return;
    const width = window.screen.width;
    const height = window.screen.height;
    window.open(
      `/${userId}/projector`,
      "ProjectorWindow",
      `width=${width},height=${height},left=12,top=12,fullscreen=no`
    );
  };

  const handleNextSlide = () => {
    if (!currentServicePlan || !currentSlide) return;
    const allSlides = currentServicePlan.items.flatMap((item) => item.slides);
    const currentIndex = allSlides.findIndex((s) => s.id === currentSlide.id);
    if (currentIndex < allSlides.length - 1) {
      goToNextSlide();
      setEndOfPresentation(false);
    } else {
      setEndOfPresentation(true);
    }
  };

  // Render content with headings and blank lines
  const renderContentWithHeadings = (content: string) => {
    return content.split("\n").map((line, idx) => {
      const trimmed = line.trim();

      if (trimmed === "___") {
        return <div key={idx} className="h-6"></div>; // blank line
      }

      if (trimmed.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-white text-xl font-semibold mb-1">
            {trimmed.replace(/^### /, "")}
          </h3>
        );
      } else if (trimmed.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-white text-2xl font-bold mb-1">
            {trimmed.replace(/^## /, "")}
          </h2>
        );
      } else if (trimmed.startsWith("# ")) {
        return (
          <h1 key={idx} className="text-white text-3xl font-extrabold mb-1">
            {trimmed.replace(/^# /, "")}
          </h1>
        );
      } else {
        return (
          <p
            key={idx}
            className="text-white text-2xl leading-relaxed whitespace-pre-wrap mb-1 text-center"
          >
            {line}
          </p>
        );
      }
    });
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
        ) : (
          <motion.div
            className="flex-1 flex flex-col justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex-1 flex flex-col gap-4">
              <Card className="w-full aspect-video bg-black border-white/20 flex flex-col items-center justify-center overflow-hidden p-4">
                {isEditing ? (
                  <div className="w-full h-full flex flex-col">
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
                ) : endOfPresentation ? (
                  <div className="flex flex-col items-center justify-center w-full h-full text-center">
                    <p className="text-white text-4xl font-bold">
                      End of Presentation
                    </p>
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
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <div className="text-center w-full px-4">
                      {currentSlide?.content
                        ? renderContentWithHeadings(currentSlide.content)
                        : ""}
                    </div>
                  </div>
                )}
              </Card>

              {currentSlide?.notes && !endOfPresentation && (
                <motion.div
                  className="mt-3 p-2 bg-yellow-600/5 border border-yellow-600/10 rounded-lg w-full text-left"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <p className="text-yellow-400/75 text-md font-medium mb-1">
                    Notes:
                  </p>
                  <p className="text-white/75 text-lg whitespace-pre-wrap">
                    {currentSlide.notes}
                  </p>
                </motion.div>
              )}
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
            onClick={handleNextSlide}
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
              className="fixed inset-0 bg-gray-900/95 z-50 p-8 overflow-auto grid gap-6"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              }}
            >
              {currentServicePlan.items
                .flatMap((item) => item.slides)
                .map((slide, index) => (
                  <div
                    key={slide.id}
                    className="bg-black/40 rounded-lg cursor-pointer hover:ring-2 hover:ring-white relative aspect-square flex items-center justify-center p-4"
                    onClick={() => {
                      goToSlide(index);
                      setEndOfPresentation(false);
                      setShowSlideOverview(false);
                    }}
                  >
                    {slide.imageUrl ? (
                      <img
                        src={slide.imageUrl}
                        alt="Slide preview"
                        className="w-full h-full object-contain rounded-md"
                      />
                    ) : (
                      <div className="text-sm text-center text-white whitespace-pre-wrap">
                        {slide.content || "Slide preview"}
                      </div>
                    )}
                  </div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
