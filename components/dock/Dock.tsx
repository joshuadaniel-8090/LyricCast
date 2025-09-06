"use client";

import { motion } from 'framer-motion';
import { Files, Monitor, ListMusic } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const dockItems = [
  { id: 'files', icon: Files, label: 'Files', view: 'files' as const },
  { id: 'preview', icon: Monitor, label: 'Preview', view: 'preview' as const },
  { id: 'service-plan', icon: ListMusic, label: 'Service Plan', view: 'service-plan' as const },
];

export default function Dock() {
  const { currentView, setCurrentView } = useAppStore();

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center gap-4 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3">
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => setCurrentView(item.view)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                isActive 
                  ? 'bg-white/20 text-white shadow-lg' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Icon size={18} />
              <span className="text-sm">{item.label}</span>
              
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}