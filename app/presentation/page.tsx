"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { loadContent } from "@/lib/content";
import Dock from "@/components/dock/Dock";
import FileNavigation from "@/components/file-navigation/FileNavigation";
import ControlPanel from "@/components/control-panel/ControlPanel";
import ServicePlanBuilder from "@/components/service-plan/ServicePlanBuilder";

export default function Home() {
  const { currentView, setContent } = useAppStore();

  useEffect(() => {
    loadContent().then((content) => {
      setContent(content);
    });
  }, [setContent]);

  const renderCurrentView = () => {
    switch (currentView) {
      case "files":
        return <FileNavigation />;
      case "preview":
        return <ControlPanel />;
      case "service-plan":
        return <ServicePlanBuilder />;
      default:
        return <ServicePlanBuilder />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]" />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 h-screen p-6 pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.header
          className="mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">LyricCast</h1>
          <p className="text-gray-400 text-lg">
            Professional presentation software for worship services
          </p>
        </motion.header>

        <motion.main
          className="h-[calc(100%-120px)]"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {renderCurrentView()}
        </motion.main>
      </motion.div>

      {/* Dock */}
      <Dock />
    </div>
  );
}
