"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Plus,
  Calendar,
  Trash2,
  Play,
  Music,
  Book,
  Layout,
  GripVertical,
  ListMusic,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const typeIcons = {
  song: Music,
  verse: Book,
  "custom-template": Layout,
};

const typeColors = {
  song: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  verse: "bg-green-500/20 text-green-400 border-green-500/30",
  "custom-template": "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export default function ServicePlanBuilder() {
  const {
    currentServicePlan,
    createServicePlan,
    setCurrentServicePlan,
    removeFromServicePlan,
    reorderServicePlan,
    goToSlide,
    servicePlans,
  } = useAppStore();

  const [showNewPlanForm, setShowNewPlanForm] = useState(false);
  const [newPlanTitle, setNewPlanTitle] = useState("");
  const [newPlanDate, setNewPlanDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleCreatePlan = () => {
    if (newPlanTitle.trim()) {
      const plan = createServicePlan(newPlanTitle, newPlanDate);
      setCurrentServicePlan(plan);
      setNewPlanTitle("");
      setShowNewPlanForm(false);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    reorderServicePlan(result.source.index, result.destination.index);
  };

  const handlePlayFrom = (itemIndex: number) => {
    if (!currentServicePlan) return;

    let slideIndex = 0;
    for (let i = 0; i < itemIndex; i++) {
      slideIndex += currentServicePlan.items[i].slides.length;
    }

    goToSlide(slideIndex);
  };

  return (
    <motion.div
      className="h-full bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Service Plan</h2>

          <Button
            onClick={() => setShowNewPlanForm(!showNewPlanForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus size={16} className="mr-2" />
            New Plan
          </Button>
        </div>

        {showNewPlanForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-black/20 rounded-xl border border-white/10"
          >
            <div className="space-y-3">
              <Input
                placeholder="Service plan title..."
                value={newPlanTitle}
                onChange={(e) => setNewPlanTitle(e.target.value)}
                className="bg-black/20 border-white/20 text-white placeholder-gray-400"
              />
              <div className="flex gap-3">
                <Input
                  type="date"
                  value={newPlanDate}
                  onChange={(e) => setNewPlanDate(e.target.value)}
                  className="bg-black/20 border-white/20 text-white"
                />
                <Button
                  onClick={handleCreatePlan}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Create
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {currentServicePlan && (
          <div className="flex items-center gap-3 text-gray-300">
            <Calendar size={16} />
            <span className="font-medium">{currentServicePlan.title}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">{currentServicePlan.date}</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {!currentServicePlan ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <ListMusic size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">No Service Plan Selected</p>
            <p className="text-sm">Create a new plan to get started</p>
          </div>
        ) : currentServicePlan.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Music size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">Empty Service Plan</p>
            <p className="text-sm">Add content from the Files tab</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="service-plan">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {currentServicePlan.items.map((item, index) => {
                    const Icon = typeIcons[item.type];
                    const colorClass = typeColors[item.type];

                    return (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`p-4 rounded-xl border transition-all ${
                              snapshot.isDragging
                                ? "bg-white/20 border-white/30 shadow-xl"
                                : "bg-black/20 border-white/10 hover:bg-black/30"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`p-2 rounded-lg border ${colorClass}`}
                                >
                                  <Icon size={16} />
                                </div>

                                <div>
                                  <p className="text-white font-medium">
                                    {item.title}
                                  </p>
                                  <p className="text-gray-400 text-sm">
                                    {item.slides.length} slide
                                    {item.slides.length !== 1 ? "s" : ""}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handlePlayFrom(index)}
                                  className="text-white hover:bg-white/20"
                                >
                                  <Play size={14} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeFromServicePlan(item.id)}
                                  className="text-red-400 hover:bg-red-500/20"
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </motion.div>
  );
}
