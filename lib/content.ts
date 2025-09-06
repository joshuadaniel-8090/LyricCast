import { ContentItem } from '@/types';
import { parseMarkdownToSlides, extractTitle } from './markdown';

export async function loadContent(): Promise<ContentItem[]> {
  const content: ContentItem[] = [];
  
  try {
    // Load songs
    const songFiles = [
      'Amazing_Grace.md',
      'How_Great_Thou_Art.md',
      'Holy_Holy_Holy.md',
    ];

    for (const filename of songFiles) {
      try {
        const response = await fetch(`/content/songs/${filename}`);
        if (response.ok) {
          const text = await response.text();
          const title = extractTitle(text);
          const slides = parseMarkdownToSlides(text);
          
          content.push({
            id: `song-${filename}`,
            title,
            type: 'song',
            filename,
            content: text,
            slides,
          });
        }
      } catch (error) {
        console.error(`Error loading song ${filename}:`, error);
      }
    }

    // Load verses
    const verseFiles = [
      'John_3_16.md',
      'Psalm_23.md',
      'Romans_8_28.md',
    ];

    for (const filename of verseFiles) {
      try {
        const response = await fetch(`/content/verses/${filename}`);
        if (response.ok) {
          const text = await response.text();
          const title = extractTitle(text);
          const slides = parseMarkdownToSlides(text);
          
          content.push({
            id: `verse-${filename}`,
            title,
            type: 'verse',
            filename,
            content: text,
            slides,
          });
        }
      } catch (error) {
        console.error(`Error loading verse ${filename}:`, error);
      }
    }

    // Load custom templates
    const templateFiles = [
      'Welcome.md',
      'Announcements.md',
      'Offering.md',
    ];

    for (const filename of templateFiles) {
      try {
        const response = await fetch(`/content/custom-templates/${filename}`);
        if (response.ok) {
          const text = await response.text();
          const title = extractTitle(text);
          const slides = parseMarkdownToSlides(text);
          
          content.push({
            id: `template-${filename}`,
            title,
            type: 'custom-template',
            filename,
            content: text,
            slides,
          });
        }
      } catch (error) {
        console.error(`Error loading template ${filename}:`, error);
      }
    }
  } catch (error) {
    console.error('Error loading content:', error);
  }

  return content;
}

export function createFileTree(content: ContentItem[]) {
  const tree = {
    songs: content.filter(item => item.type === 'song'),
    verses: content.filter(item => item.type === 'verse'),
    customTemplates: content.filter(item => item.type === 'custom-template'),
  };

  return tree;
}