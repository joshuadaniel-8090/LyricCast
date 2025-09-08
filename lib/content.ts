import fs from "fs";
import path from "path";
import { ContentItem, ContentTree } from "@/types";
import { parseMarkdownToSlides, extractTitle } from "./markdown";

// Recursively read all .md files from a folder and keep relative paths
function getMarkdownFiles(folder: string): string[] {
  const dirPath = path.join(process.cwd(), "public", "content", folder);
  if (!fs.existsSync(dirPath)) return [];

  function walkDir(currentPath: string): string[] {
    return fs
      .readdirSync(currentPath, { withFileTypes: true })
      .flatMap((entry) => {
        const fullPath = path.join(currentPath, entry.name);
        if (entry.isDirectory()) return walkDir(fullPath);
        else if (entry.isFile() && entry.name.endsWith(".md"))
          return [path.relative(dirPath, fullPath).split(path.sep).join("/")]; // normalize slashes
        return [];
      });
  }

  return walkDir(dirPath);
}

// Convert flat file list into nested folder tree
function buildTree(
  files: string[],
  type: ContentItem["type"],
  baseFolder: string
) {
  const tree: any = {};

  files.forEach((file) => {
    const parts = file.split("/"); // always use forward slash
    let current = tree;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        // This is a file
        const fullPath = path.join(
          process.cwd(),
          "public",
          "content",
          baseFolder,
          ...parts
        );
        const text = fs.readFileSync(fullPath, "utf-8");
        const title = extractTitle(text);
        const slides = parseMarkdownToSlides(text);

        if (!current.files) current.files = [];
        current.files.push({
          id: `${type}-${file.replace(/\//g, "-")}`,
          title,
          type,
          filename: file,
          content: text,
          slides,
        });
      } else {
        // Folder
        if (!current[part]) current[part] = {};
        current = current[part];
      }
    }
  });

  return tree;
}

export async function loadContent(): Promise<ContentTree> {
  const songFiles = getMarkdownFiles("songs");
  const verseFiles = getMarkdownFiles("verses");
  const templateFiles = getMarkdownFiles("custom-templates");

  return {
    songs: buildTree(songFiles, "song", "songs"),
    verses: buildTree(verseFiles, "verse", "verses"),
    "custom-templates": buildTree(
      templateFiles,
      "custom-template",
      "custom-templates"
    ),
  };
}
