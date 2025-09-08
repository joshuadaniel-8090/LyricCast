"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import FileNavigation from "@/components/file-navigation/FileNavigation";
import ControlPanel from "@/components/control-panel/ControlPanel";
import ServicePlanBuilder from "@/components/service-plan/ServicePlanBuilder";
import { ContentItem, ContentTree } from "@/types";

export default function ClientContentLoader({
  content,
}: {
  content: ContentTree;
}) {
  const { setContent, currentView } = useAppStore();

  useEffect(() => {
    setContent(content);
  }, [content, setContent]);

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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="h-full"
    >
      {renderCurrentView()}
    </motion.div>
  );
}
