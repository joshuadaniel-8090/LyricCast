"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Folder, FileText, Music, Book, Layout } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ContentItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

export default function FileNavigation() {
  const { content, addToServicePlan, currentServicePlan } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['songs', 'verses', 'custom-templates'])
  );

  const filteredContent = useMemo(() => {
    if (!searchQuery) return content;
    
    return content.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.filename.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [content, searchQuery]);

  const groupedContent = useMemo(() => {
    const groups = {
      songs: filteredContent.filter(item => item.type === 'song'),
      verses: filteredContent.filter(item => item.type === 'verse'),
      'custom-templates': filteredContent.filter(item => item.type === 'custom-template'),
    };
    return groups;
  }, [filteredContent]);

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleAddToServicePlan = (item: ContentItem) => {
    if (currentServicePlan) {
      addToServicePlan(item);
    }
  };

  const folderLabels = {
    songs: 'Songs',
    verses: 'Bible Verses',
    'custom-templates': 'Custom Templates',
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-black/20 border-white/20 text-white placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {Object.entries(groupedContent).map(([folderId, items]) => {
          const isExpanded = expandedFolders.has(folderId);
          
          return (
            <motion.div
              key={folderId}
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <motion.button
                onClick={() => toggleFolder(folderId)}
                className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Folder className="text-gray-400" size={18} />
                </motion.div>
                <span className="font-medium text-white">
                  {folderLabels[folderId as keyof typeof folderLabels]} ({items.length})
                </span>
              </motion.button>

              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: isExpanded ? 'auto' : 0, 
                  opacity: isExpanded ? 1 : 0 
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="ml-6 mt-2 space-y-2">
                  {items.map((item) => {
                    const Icon = typeIcons[item.type];
                    const colorClass = typeColors[item.type];
                    
                    return (
                      <motion.div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors group"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={colorClass} size={16} />
                          <div>
                            <p className="text-white font-medium">{item.title}</p>
                            <p className="text-gray-400 text-sm">{item.slides.length} slides</p>
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => handleAddToServicePlan(item)}
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-white/20"
                          disabled={!currentServicePlan}
                        >
                          <Plus size={16} />
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}