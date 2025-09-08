export interface ContentItem {
  id: string;
  title: string;
  type: "song" | "verse" | "custom-template";
  filename: string;
  content: string;
  slides: Slide[];
}
export type FolderNode = {
  files?: ContentItem[];
  [subFolder: string]: FolderNode | ContentItem[] | undefined;
};

export type ContentTree = {
  songs: FolderNode;
  verses: FolderNode;
  "custom-templates": FolderNode;
};
export interface Slide {
  title: string;
  id: string;
  content: string;
  type: "text" | "image" | "video" | "countdown" | "blank" | "logo";
  notes?: string;
  duration?: number;
  imageUrl?: string;
  videoUrl?: string;
  countdown?: {
    minutes: number;
    seconds: number;
  };
}

export interface ServicePlan {
  id: string;
  title: string;
  date: string;
  items: ServicePlanItem[];
  currentSlideIndex: number;
  isActive: boolean;
}

export interface ServicePlanItem {
  id: string;
  contentId: string;
  title: string;
  type: "song" | "verse" | "custom-template";
  slides: Slide[];
  order: number;
}

export interface AppState {
  currentView: "files" | "preview" | "service-plan";
  servicePlans: ServicePlan[];
  currentServicePlan: ServicePlan | null;
  currentSlide: Slide | null;
  nextSlide: Slide | null;
  content: ContentTree;
  isProjectorOpen: boolean;
  showBlank: boolean;
  showLogo: boolean;
  showTimer: boolean;
}

export interface FileTreeNode {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
  children?: FileTreeNode[];
  contentItem?: ContentItem;
}
