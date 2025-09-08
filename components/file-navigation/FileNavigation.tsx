"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Folder, Music, Book, Layout } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ContentItem } from "@/types";
import { Input } from "@/components/ui/input";

// Map content types to icons and colors
const typeIcons = { song: Music, verse: Book, "custom-template": Layout };
const typeColors = {
  song: "text-blue-400",
  verse: "text-green-400",
  "custom-template": "text-purple-400",
};

// Recursive filter function
function filterTree(
  node: any,
  query: string,
  expanded: Set<string>,
  path = ""
): any {
  if (!node) return null;

  if (Array.isArray(node)) {
    const matchedFiles = node.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    return matchedFiles.length ? matchedFiles : null;
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
        expanded.add(path);
      }
    } else {
      const subPath = path ? `${path}/${key}` : key;
      const filteredSub = filterTree(value, query, expanded, subPath);
      if (filteredSub) {
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
  firstMatchRef,
}: {
  folderName: string;
  items: any;
  expandedFolders: Set<string>;
  toggleFolder: (folderId: string) => void;
  handleAdd: (item: ContentItem) => void;
  path?: string;
  firstMatchRef: React.MutableRefObject<HTMLDivElement | null>;
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
          {files.map((item, idx) => {
            const Icon = typeIcons[item.type as keyof typeof typeIcons];
            const colorClass = typeColors[item.type as keyof typeof typeColors];

            // Attach ref to first matching file for scrolling
            const ref =
              idx === 0 && !firstMatchRef.current ? firstMatchRef : undefined;

            return (
              <motion.div
                key={item.id}
                ref={ref as any}
                onClick={() => handleAdd(item)} // Click anywhere on the item to add
                className="flex items-center justify-start gap-3 p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors cursor-pointer"
              >
                <Icon className={colorClass} size={16} />
                <div>
                  <p className="text-white font-medium">{item.title}</p>
                  <p className="text-gray-400 text-sm">
                    {item.slides.length} slides
                  </p>
                </div>
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
              firstMatchRef={firstMatchRef}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Main Component
export default function FileNavigation() {
  const { content, addToServicePlan, currentServicePlan } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const firstMatchRef = useRef<HTMLDivElement | null>(null);

  const handleAddToServicePlan = (item: ContentItem) => {
    if (currentServicePlan) addToServicePlan(item);
  };

  // Filter content and track expanded folders
  const { filteredContent, newExpanded } = useMemo(() => {
    const expanded = new Set<string>();
    const filtered = {
      songs: searchQuery
        ? filterTree(content.songs, searchQuery, expanded) || {}
        : content.songs,
      verses: searchQuery
        ? filterTree(content.verses, searchQuery, expanded) || {}
        : content.verses,
      "custom-templates": searchQuery
        ? filterTree(content["custom-templates"], searchQuery, expanded) || {}
        : content["custom-templates"],
    };
    return { filteredContent: filtered, newExpanded: expanded };
  }, [content, searchQuery]);

  // Update expanded folders and scroll to first match on search
  useEffect(() => {
    if (searchQuery) {
      setExpandedFolders(new Set(newExpanded));
      if (firstMatchRef.current) {
        firstMatchRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [searchQuery, newExpanded]);

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
        {Object.entries(filteredContent).map(([folderName, items]) => (
          <FolderRenderer
            key={folderName}
            folderName={folderName}
            items={items}
            expandedFolders={expandedFolders}
            toggleFolder={toggleFolder}
            handleAdd={handleAddToServicePlan}
            firstMatchRef={firstMatchRef}
          />
        ))}
      </div>
    </motion.div>
  );
}
