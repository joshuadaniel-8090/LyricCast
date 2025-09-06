"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Square, Crown, Timer, Edit3, Save, X } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

export default function CurrentSlidePreview() {
  const { 
    currentSlide, 
    showBlank, 
    showLogo, 
    showTimer, 
    toggleProjector, 
    toggleBlank, 
    toggleLogo, 
    toggleTimer,
    isProjectorOpen 
  } = useAppStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  const handleEditStart = () => {
    setEditContent(currentSlide?.content || '');
    setIsEditing(true);
  };

  const handleEditSave = () => {
    // In a real app, this would update the slide content
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditContent('');
  };

  return (
    <motion.div
      className="h-full bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Current Slide</h3>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleProjector}
              className={`text-white ${isProjectorOpen ? 'bg-green-600/20' : 'hover:bg-white/20'}`}
            >
              <Monitor size={14} />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={handleEditStart}
              className="text-white hover:bg-white/20"
              disabled={!currentSlide}
            >
              <Edit3 size={14} />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleBlank}
            className={`${showBlank ? 'bg-red-600/20 text-red-400' : 'text-white hover:bg-white/20'}`}
          >
            <Square size={14} className="mr-1" />
            Blank
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleLogo}
            className={`${showLogo ? 'bg-yellow-600/20 text-yellow-400' : 'text-white hover:bg-white/20'}`}
          >
            <Crown size={14} className="mr-1" />
            Logo
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleTimer}
            className={`${showTimer ? 'bg-blue-600/20 text-blue-400' : 'text-white hover:bg-white/20'}`}
          >
            <Timer size={14} className="mr-1" />
            Timer
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4">
        {!currentSlide ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Monitor size={48} className="mx-auto mb-4 opacity-50" />
              <p className="font-medium">No slide selected</p>
            </div>
          </div>
        ) : (
          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full bg-black border-white/20 overflow-hidden">
              {isEditing ? (
                <div className="h-full p-4 flex flex-col">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="flex-1 bg-transparent border-none text-white resize-none focus:ring-0"
                    placeholder="Edit slide content..."
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <Button size="sm" variant="ghost" onClick={handleEditCancel}>
                      <X size={14} className="mr-1" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleEditSave} className="bg-green-600 hover:bg-green-700">
                      <Save size={14} className="mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-full p-8 flex items-center justify-center">
                  {showBlank ? (
                    <div className="text-center">
                      <Square size={48} className="mx-auto mb-4 text-gray-500" />
                      <p className="text-gray-400">Blank Screen</p>
                    </div>
                  ) : showLogo ? (
                    <div className="text-center">
                      <Crown size={48} className="mx-auto mb-4 text-yellow-400" />
                      <p className="text-yellow-400">Church Logo</p>
                    </div>
                  ) : currentSlide.type === 'image' && currentSlide.imageUrl ? (
                    <img
                      src={currentSlide.imageUrl}
                      alt="Slide content"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : currentSlide.type === 'countdown' && currentSlide.countdown ? (
                    <div className="text-center">
                      <Timer size={48} className="mx-auto mb-4 text-blue-400" />
                      <p className="text-6xl font-bold text-white">
                        {String(currentSlide.countdown.minutes).padStart(2, '0')}:
                        {String(currentSlide.countdown.seconds).padStart(2, '0')}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-white text-2xl leading-relaxed whitespace-pre-wrap">
                        {currentSlide.content}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {currentSlide.notes && !isEditing && (
              <motion.div
                className="mt-4 p-3 bg-yellow-600/10 border border-yellow-600/20 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <p className="text-yellow-400 text-sm font-medium mb-1">Presenter Note:</p>
                <p className="text-white text-sm">{currentSlide.notes}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}