import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import { Slide } from '@/types';

const processor = remark().use(remarkGfm);

export function parseMarkdownToSlides(content: string): Slide[] {
  const slides: Slide[] = [];
  const slideTexts = content.split('---').map(slide => slide.trim()).filter(Boolean);

  slideTexts.forEach((slideText, index) => {
    const lines = slideText.split('\n');
    let slideContent = '';
    let notes = '';
    let type: Slide['type'] = 'text';
    let imageUrl = '';
    let videoUrl = '';
    let countdown = undefined;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('> NOTE:')) {
        notes += trimmedLine.replace('> NOTE:', '').trim() + '\n';
      } else if (trimmedLine.startsWith('![')) {
        // Image slide
        const imageMatch = trimmedLine.match(/!\[.*?\]\((.*?)\)/);
        if (imageMatch) {
          imageUrl = imageMatch[1];
          type = 'image';
        }
      } else if (trimmedLine.startsWith('(video:')) {
        // Video slide
        const videoMatch = trimmedLine.match(/\(video:\s*(.*?)\)/);
        if (videoMatch) {
          videoUrl = videoMatch[1];
          type = 'video';
        }
      } else if (trimmedLine.startsWith('(countdown:')) {
        // Countdown slide
        const countdownMatch = trimmedLine.match(/\(countdown:\s*(\d+):(\d+)\)/);
        if (countdownMatch) {
          countdown = {
            minutes: parseInt(countdownMatch[1]),
            seconds: parseInt(countdownMatch[2]),
          };
          type = 'countdown';
        }
      } else if (trimmedLine.startsWith('(blank)')) {
        type = 'blank';
      } else if (trimmedLine.startsWith('(logo)')) {
        type = 'logo';
      } else {
        slideContent += line + '\n';
      }
    }

    slides.push({
      id: `slide-${index}`,
      content: slideContent.trim(),
      type,
      notes: notes.trim() || undefined,
      imageUrl: imageUrl || undefined,
      videoUrl: videoUrl || undefined,
      countdown,
    });
  });

  return slides;
}

export function renderMarkdownToHtml(content: string): string {
  try {
    const result = processor.processSync(content);
    return String(result);
  } catch (error) {
    console.error('Error rendering markdown:', error);
    return content;
  }
}

export function extractTitle(content: string): string {
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.startsWith('# ')) {
      return line.replace('# ', '').trim();
    }
  }
  return 'Untitled';
}