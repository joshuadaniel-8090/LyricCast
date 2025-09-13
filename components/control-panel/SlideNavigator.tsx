"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Music, Book, Layout, GripVertical } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

const typeIcons = {
  song: Music,
  verse: Book,
  "custom-template": Layout,
};

const typeColors = {
  song: "text-blue-400",
  verse: "text-green-400",
  "custom-template": "text-purple-400",
};

function SortableItem({
  id,
  children,
}: {
  id: string;
  children: (listeners: any) => React.ReactNode; // <-- children is a function
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children(listeners)} {/* pass drag listeners down */}
    </div>
  );
}

export default function SlideNavigator() {
  const { currentServicePlan, goToSlide, reorderServicePlan } = useAppStore();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [manualExpand, setManualExpand] = useState(false);

  const currentSlideIndex = currentServicePlan?.currentSlideIndex ?? 0;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const slidesMap = useMemo(() => {
    if (!currentServicePlan) return [];
    let counter = 0;
    return currentServicePlan.items.map((item) => {
      const slides = item.slides.map((slide) => ({
        ...slide,
        globalIndex: counter++,
      }));
      return { ...item, slides };
    });
  }, [currentServicePlan]);

  useEffect(() => {
    if (!currentServicePlan || manualExpand) return;
    const currentItem = slidesMap.find((item) =>
      item.slides.some((s) => s.globalIndex === currentSlideIndex)
    );
    if (currentItem) setExpandedItem(currentItem.id);
  }, [currentServicePlan, currentSlideIndex, slidesMap, manualExpand]);

  const handleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
    setManualExpand(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!currentServicePlan) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = currentServicePlan.items.findIndex(
      (i) => i.id === active.id
    );
    const newIndex = currentServicePlan.items.findIndex(
      (i) => i.id === over.id
    );
    if (oldIndex !== -1 && newIndex !== -1)
      reorderServicePlan(oldIndex, newIndex);
  };

  return (
    <motion.div
      className="h-full bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">Slides</h3>
        <p className="text-sm text-gray-400">
          {currentServicePlan?.items.reduce(
            (total, item) => total + item.slides.length,
            0
          )}{" "}
          total slides
        </p>
      </div>

      <ScrollArea className="flex-1">
        {currentServicePlan && currentServicePlan.items.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={currentServicePlan.items.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="p-4 space-y-4">
                {slidesMap.map((item) => {
                  const Icon = typeIcons[item.type];
                  const colorClass = typeColors[item.type];
                  const isExpanded = expandedItem === item.id;

                  return (
                    <SortableItem key={item.id} id={item.id}>
                      {(listeners) => (
                        <div className="space-y-2 w-full">
                          <button
                            {...listeners} // entire row is draggable
                            onClick={() => handleExpand(item.id)} // click still expands
                            className="flex items-center gap-2 w-full py-2 px-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition relative cursor-grab active:cursor-grabbing"
                          >
                            {/* Type icon */}
                            <Icon className={`${colorClass}`} size={16} />

                            {/* Title */}
                            <span className="text-white text-sm font-medium truncate">
                              {item.title}
                            </span>

                            {/* Expand arrow */}
                            <ChevronRight
                              className={`text-gray-500 ml-auto transition-transform ${
                                isExpanded ? "rotate-90" : ""
                              }`}
                              size={14}
                            />
                          </button>

                          {isExpanded && (
                            <div className="space-y-2 ml-2">
                              {item.slides.map((slide) => {
                                const isActive =
                                  slide.globalIndex === currentSlideIndex;
                                return (
                                  <motion.button
                                    key={slide.id}
                                    onClick={() => {
                                      goToSlide(slide.globalIndex);
                                      setManualExpand(false);
                                    }}
                                    className={`w-full text-left p-3 rounded-lg transition-all shadow-sm ${
                                      isActive
                                        ? "bg-gradient-to-r from-blue-600/60 to-blue-400/40 border border-blue-400 text-white"
                                        : "bg-white/5 hover:bg-white/10 text-gray-300 border border-transparent"
                                    }`}
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm truncate">
                                        {slide.content
                                          .split("\n")[0]
                                          .replace("#", "")
                                          .trim() || "Slide"}
                                      </span>
                                      <span className="text-xs text-gray-400">
                                        #{slide.globalIndex + 1}
                                      </span>
                                    </div>
                                  </motion.button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </SortableItem>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2 p-4">
            <div className="rounded-xl w-full max-w-xs p-6 flex flex-col items-center justify-center">
              <Music size={48} className="mb-4 opacity-50" />
              <p className="text-sm text-gray-200 text-center">
                No slides to navigate
              </p>
            </div>
          </div>
        )}
      </ScrollArea>
    </motion.div>
  );
}
