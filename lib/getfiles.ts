import fs from "fs";
import path from "path";

export function getMarkdownFiles(folder: string): string[] {
  const dirPath = path.join(process.cwd(), "public", "content", folder);
  return fs.readdirSync(dirPath).filter((file) => file.endsWith(".md"));
}
