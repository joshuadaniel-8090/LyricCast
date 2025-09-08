"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Folder, Music, Book, Layout } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ContentItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Map types to icons and colors
const typeIcons = { song: Music, verse: Book, "custom-template": Layout };
const typeColors = {
  song: "text-blue-400",
  verse: "text-green-400",
  "custom-template": "text-purple-400",
};

// Recursive search filter for FolderNode structure
function filterTree(
  node: any,
  query: string,
  expanded: Set<string>,
  parentPath: string = ""
): any {
  if (!node) return null;

  if (Array.isArray(node)) {
    const matchedFiles = node.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    if (matchedFiles.length) return matchedFiles;
    return null;
  }

  const result: any = {};
  let hasMatch = false;

  for (const [key, value] of Object.entries(node)) {
    if (key === "files") {
      const matchedFiles = (value as ContentItem[]).filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      if (matchedFiles.length) {
        result.files = matchedFiles;
        hasMatch = true;
        expanded.add(parentPath); // expand parent folder
      }
    } else {
      const subPath = parentPath ? `${parentPath}/${key}` : key;
      const filteredSub = filterTree(value, query, expanded, subPath);
      if (
        filteredSub &&
        (Object.keys(filteredSub).length > 0 ||
          (filteredSub.files?.length ?? 0))
      ) {
        result[key] = filteredSub;
        hasMatch = true;
        expanded.add(subPath);
      }
    }
  }

  return hasMatch ? result : null;
}

// Recursive Folder Renderer
function FolderRenderer({
  folderName,
  items,
  expandedFolders,
  toggleFolder,
  handleAdd,
  path = "",
}: {
  folderName: string;
  items: any;
  expandedFolders: Set<string>;
  toggleFolder: (folderId: string) => void;
  handleAdd: (item: ContentItem) => void;
  path?: string;
}) {
  const fullPath = path ? `${path}/${folderName}` : folderName;
  const isExpanded = expandedFolders.has(fullPath);

  const files: ContentItem[] = Array.isArray(items) ? items : items.files ?? [];
  const subfolders: Record<string, any> = Array.isArray(items)
    ? {}
    : { ...items };
  delete subfolders.files;

  return (
    <motion.div key={fullPath} className="mb-4">
      <motion.button
        onClick={() => toggleFolder(fullPath)}
        className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
      >
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Folder className="text-gray-400" size={18} />
        </motion.div>
        <span className="font-medium text-white">
          {folderName} (
          {files.length +
            Object.values(subfolders).flatMap((f) => f.files ?? []).length}
          )
        </span>
      </motion.button>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="ml-6 mt-2 space-y-2">
          {files.map((item) => {
            const Icon = typeIcons[item.type as keyof typeof typeIcons];
            const colorClass = typeColors[item.type as keyof typeof typeColors];

            return (
              <motion.div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Icon className={colorClass} size={16} />
                  <div>
                    <p className="text-white font-medium">{item.title}</p>
                    <p className="text-gray-400 text-sm">
                      {item.slides.length} slides
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleAdd(item)}
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-white/20"
                >
                  <Plus size={16} />
                </Button>
              </motion.div>
            );
          })}

          {Object.entries(subfolders).map(([subName, subItems]) => (
            <FolderRenderer
              key={subName}
              folderName={subName}
              items={subItems}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              handleAdd={handleAdd}
              path={fullPath}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FileNavigation() {
  const { content, addToServicePlan, currentServicePlan } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );

  const handleAddToServicePlan = (item: ContentItem) => {
    if (currentServicePlan) addToServicePlan(item);
  };

  const filteredContent = useMemo(() => {
    const newExpanded = new Set<string>();

    return {
      songs: searchQuery
        ? filterTree(content.songs, searchQuery, newExpanded) || {}
        : content.songs,
      verses: searchQuery
        ? filterTree(content.verses, searchQuery, newExpanded) || {}
        : content.verses,
      "custom-templates": searchQuery
        ? filterTree(content["custom-templates"], searchQuery, newExpanded) ||
          {}
        : content["custom-templates"],
      newExpanded,
    };
  }, [content, searchQuery]);

  // Auto-expand folders with matches
  useEffect(() => {
    if (searchQuery && filteredContent.newExpanded) {
      setExpandedFolders(new Set(filteredContent.newExpanded));
    }
  }, [searchQuery, filteredContent.newExpanded]);

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) newExpanded.delete(folderId);
    else newExpanded.add(folderId);
    setExpandedFolders(newExpanded);
  };

  return (
    <motion.div
      className="h-full bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-bold text-white mb-4">Content Library</h2>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-black/20 border-white/20 text-white placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {Object.entries({
          songs: filteredContent.songs,
          verses: filteredContent.verses,
          "custom-templates": filteredContent["custom-templates"],
        }).map(([folderName, items]) => (
          <FolderRenderer
            key={folderName}
            folderName={folderName}
            items={items}
            expandedFolders={expandedFolders}
            toggleFolder={toggleFolder}
            handleAdd={handleAddToServicePlan}
          />
        ))}
      </div>
    </motion.div>
  );
}
