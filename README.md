# LyricCast

A modern, browser-based worship presentation application built with Next.js. This app replaces traditional PowerPoint presentations for church services with a streamlined, professional solution.

## Features

- **Service Plan Builder**: Create and manage service plans with drag-and-drop functionality
- **3-Column Control Interface**: Navigate slides with current/next preview and slide navigator
- **Projection Display**: Secondary monitor support with fullscreen presentation mode
- **Markdown Content**: Songs, Bible verses, and custom templates stored as Markdown files
- **Keyboard Shortcuts**: Quick navigation with arrow keys, blank (B), logo (L), and timer (T)
- **Smooth Animations**: Professional transitions powered by Framer Motion

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Application**
   - Main interface: http://localhost:3000
   - Projection display: http://localhost:3000/projector

## Content Structure

Content is organized in three folders under `/public/content/`:

### Songs (`/public/content/songs/`)
- Worship songs with verses and choruses
- Presenter notes for musicians
- Example: `Amazing_Grace.md`

### Bible Verses (`/public/content/verses/`)
- Scripture passages for readings
- Reference information
- Example: `John_3_16.md`

### Custom Templates (`/public/content/custom-templates/`)
- Welcome messages, announcements, offering
- Countdown timers and blank slides
- Example: `Welcome.md`

## Markdown Format

Content uses a simple Markdown format:

```markdown
# Slide Title
Slide content goes here

> NOTE: This is a presenter note (only visible on main display)

---

# Next Slide
More content here

![Alt text](image-url.jpg)
(video: video-url.mp4)
(countdown: 05:00)
(blank)
(logo)
```

## Keyboard Shortcuts

- **→** Next slide
- **←** Previous slide  
- **B** Toggle blank screen
- **L** Toggle logo display
- **T** Toggle timer display
- **ESC** Exit fullscreen (projector display)

## Usage Workflow

1. **Create Service Plan**: Use the dock navigation to access "Service Plan" and create a new plan
2. **Add Content**: Switch to "Files" view and browse/add songs, verses, and templates to your plan
3. **Control Presentation**: Use "Preview" view for the 3-column control interface
4. **Open Projector**: Click the monitor button to open the projection display on secondary monitor
5. **Navigate**: Use keyboard shortcuts or click navigation to control slides during service

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion for smooth transitions
- **Content**: Markdown processing with remark
- **State Management**: Zustand with localStorage persistence
- **UI Components**: Radix UI + shadcn/ui components

## Build for Production

```bash
npm run build
```

The app will build as a static export that can be deployed to any web server or hosting platform.

## Customization

- **Content**: Add your own `.md` files to the content folders
- **Styling**: Modify `tailwind.config.ts` for custom colors and themes
- **Logo**: Update the logo display in `app/projector/page.tsx`
- **Church Name**: Update references throughout the app

## Browser Compatibility

- Modern browsers with ES6+ support
- Fullscreen API support recommended for projection display
- WebKit/Blink engines preferred for best performance

## Support

This is an open-source project. For issues or feature requests, please refer to the project documentation or community resources.