"use client";

import { motion } from 'framer-motion';
import { ChevronRight, Music, Book, Layout } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const typeIcons = {
  song: Music,
  verse: Book,
  'custom-template': Layout,
};

const typeColors = {
  song: 'text-blue-400',
  verse: 'text-green-400',
  'custom-template': 'text-purple-400',
};

export default function SlideNavigator() {
  const { currentServicePlan, goToSlide, currentSlide } = useAppStore();

  if (!currentServicePlan || currentServicePlan.items.length === 0) {
    return (
      <motion.div
        className="h-full bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center text-gray-400">
          <Music size={48} className="mx-auto mb-4 opacity-50" />
          <p className="font-medium">No slides to navigate</p>
        </div>
      </motion.div>
    );
  }

  let slideIndex = 0;
  const currentSlideIndex = currentServicePlan.currentSlideIndex;

  return (
    <motion.div
      className="h-full bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">Slides</h3>
        <p className="text-sm text-gray-400">
          {currentServicePlan.items.reduce((total, item) => total + item.slides.length, 0)} total slides
        </p>
      </div>

      <ScrollArea className="flex-1 h-[calc(100%-80px)]">
        <div className="p-4 space-y-2">
          {currentServicePlan.items.map((item) => {
            const Icon = typeIcons[item.type];
            const colorClass = typeColors[item.type];
            
            return (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center gap-2 py-2 px-3 bg-black/20 rounded-lg">
                  <Icon className={colorClass} size={16} />
                  <span className="text-white text-sm font-medium">{item.title}</span>
                  <ChevronRight className="text-gray-500 ml-auto" size={14} />
                </div>
                
                {item.slides.map((slide, index) => {
                  const globalSlideIndex = slideIndex + index;
                  const isActive = globalSlideIndex === currentSlideIndex;
                  
                  return (
                    <motion.button
                      key={slide.id}
                      onClick={() => goToSlide(globalSlideIndex)}
                      className={`w-full text-left p-3 ml-4 rounded-lg transition-all ${
                        isActive
                          ? 'bg-blue-600/30 border-l-2 border-blue-400 text-white'
                          : 'bg-black/10 hover:bg-black/20 text-gray-300'
                      }`}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          {slide.content.split('\n')[0].replace('#', '').trim() || 'Slide'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {globalSlideIndex + 1}
                        </span>
                      </div>
                      {slide.notes && (
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          Note: {slide.notes}
                        </p>
                      )}
                    </motion.button>
                  );
                })}
                {(() => {
                  slideIndex += item.slides.length;
                  return null;
                })()}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </motion.div>
  );
}