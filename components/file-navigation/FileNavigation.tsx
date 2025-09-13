"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Music, Book, Layout, Folder } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ContentItem } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

// Icon mapping
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
    const matchedFiles = node.filter((item: ContentItem) =>
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

// Folder Renderer
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
        className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors top-0 z-10"
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
            const ref =
              idx === 0 && !firstMatchRef.current ? firstMatchRef : undefined;

            return (
              <motion.div
                key={item.id}
                ref={ref as any}
                onClick={() => handleAdd(item)}
                className="flex flex-col cursor-pointer"
              >
                <div className="flex items-center gap-3 p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors">
                  <Icon className={colorClass} size={16} />
                  <div>
                    <p className="text-white font-medium">{item.title}</p>
                    <p className="text-gray-400 text-sm">
                      {item.slides.length} slides
                    </p>
                  </div>
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

// Main component
export default function FileNavigation() {
  const { content, addToServicePlan, currentServicePlan } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const firstMatchRef = useRef<HTMLDivElement | null>(null);

  const handleAddToServicePlan = (item: ContentItem) => {
    if (currentServicePlan) {
      addToServicePlan(item);

      // ✅ Show toast for each type
      if (item.type === "song") {
        toast({
          title: "Song Added 🎵",
          description: `${item.title} has been added to the plan.`,
        });
      } else if (item.type === "verse") {
        toast({
          title: "Verse Added 📖",
          description: `${item.title} has been added to the plan.`,
        });
      } else if (item.type === "custom-template") {
        toast({
          title: "Template Added 📑",
          description: `${item.title} has been added to the plan.`,
        });
      }
    }
  };

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

  useEffect(() => {
    if (searchQuery) {
      // Automatically expand all parent folders of matched items
      setExpandedFolders(new Set(newExpanded));

      // Scroll to the first matched item
      if (firstMatchRef.current) {
        // Expand all parent folders in the DOM (already in expandedFolders)
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
      className="h-[58rem] flex flex-col gap-4 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search songs, verses, templates..."
          className="w-full p-3 rounded-lg bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 flex-1 h-full">
        {(["songs", "verses", "custom-templates"] as const).map(
          (folderName) => {
            const items = filteredContent[folderName];
            if (!items) return null;

            const Icon =
              folderName === "songs"
                ? Music
                : folderName === "verses"
                ? Book
                : Layout;
            const colorClass =
              folderName === "songs"
                ? "text-blue-400"
                : folderName === "verses"
                ? "text-green-400"
                : "text-purple-400";

            return (
              <div
                key={folderName}
                className="flex flex-col bg-black/20 rounded-xl p-3"
                style={{ minHeight: 0 }}
              >
                <div className="flex items-center gap-2 mb-2 sticky top-0 z-10 bg-black/30 backdrop-blur-md p-2">
                  <Icon className={colorClass} size={18} />
                  <span className="text-white font-semibold capitalize">
                    {folderName.replace("-", " ")}
                  </span>
                </div>

                {/* Make each column independently scrollable */}
                <ScrollArea className="flex-1 h-[calc(58rem-6rem)]">
                  <FolderRenderer
                    folderName={folderName}
                    items={items}
                    expandedFolders={expandedFolders}
                    toggleFolder={toggleFolder}
                    handleAdd={handleAddToServicePlan}
                    firstMatchRef={firstMatchRef}
                  />
                </ScrollArea>
              </div>
            );
          }
        )}
      </div>
    </motion.div>
  );
}
