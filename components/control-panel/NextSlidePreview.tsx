"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Square, Crown, Timer } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';

export default function NextSlidePreview() {
  const { nextSlide: nextSlideData } = useAppStore();

  return (
    <motion.div
      className="h-full bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <ArrowRight size={18} className="text-gray-400" />
          <h3 className="text-lg font-semibold text-white">Next Slide</h3>
        </div>
      </div>

      <div className="flex-1 p-4">
        {!nextSlideData ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <ArrowRight size={48} className="mx-auto mb-4 opacity-50" />
              <p className="font-medium">No next slide</p>
            </div>
          </div>
        ) : (
          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full bg-black/50 border-white/10 overflow-hidden">
              <div className="h-full p-6 flex items-center justify-center">
                {nextSlideData.type === 'image' && nextSlideData.imageUrl ? (
                  <img
                    src={nextSlideData.imageUrl}
                    alt="Next slide content"
                    className="max-w-full max-h-full object-contain opacity-75"
                  />
                ) : nextSlideData.type === 'countdown' && nextSlideData.countdown ? (
                  <div className="text-center opacity-75">
                    <Timer size={32} className="mx-auto mb-3 text-blue-400" />
                    <p className="text-4xl font-bold text-white">
                      {String(nextSlideData.countdown.minutes).padStart(2, '0')}:
                      {String(nextSlideData.countdown.seconds).padStart(2, '0')}
                    </p>
                  </div>
                ) : nextSlideData.type === 'blank' ? (
                  <div className="text-center opacity-75">
                    <Square size={32} className="mx-auto mb-3 text-gray-500" />
                    <p className="text-gray-400">Blank Screen</p>
                  </div>
                ) : nextSlideData.type === 'logo' ? (
                  <div className="text-center opacity-75">
                    <Crown size={32} className="mx-auto mb-3 text-yellow-400" />
                    <p className="text-yellow-400">Church Logo</p>
                  </div>
                ) : (
                  <div className="text-center opacity-75">
                    <div className="text-white text-lg leading-relaxed whitespace-pre-wrap">
                      {nextSlideData.content}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {nextSlideData.notes && (
              <motion.div
                className="mt-3 p-2 bg-yellow-600/5 border border-yellow-600/10 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <p className="text-yellow-400/75 text-xs font-medium mb-1">Next Note:</p>
                <p className="text-white/75 text-xs">{nextSlideData.notes}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}