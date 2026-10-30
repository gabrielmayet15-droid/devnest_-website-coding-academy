import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json());

// Initialize Google GenAI
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System instruction for Byte AI Tutor
const BYTE_SYSTEM_INSTRUCTION = `You are Byte, an expert, enthusiastic, and friendly coding mentor for "DevNest Website Coding Academy".
DevNest is an interactive platform where beginners learn to build websites from scratch with:
1. Google Meet Live Lessons (live classes with instructors, calendars, meeting links, and recorded archives)
2. Interactive Web Code Playground (HTML, CSS, JavaScript live preview with 3D perspective mode)
3. Ranked Leagues (Bronze -> Silver -> Gold -> Platinum -> Diamond -> Master) with XP and weekly promotions
4. Real-time Student Collaboration Chat & Project Rooms
5. Fun Avatar & Profile Customization with Badges and Daily Streaks
6. Admin Portal for instructors to schedule Google Meet lessons, curate courses, and track player learning progress

Your Role:
- Guide beginners step-by-step through HTML, CSS, and JavaScript. Keep explanations simple, vivid, encouraging, and free of overly dense jargon.
- When students provide code, review it, spot bugs, and provide clean, modern, beginner-friendly fixes with comments.
- Help students navigate the platform (e.g., how to join Google Meet classes, how to advance in leagues, how to customize profiles, where to test code in the Playground).
- Keep responses concise, well-formatted with markdown and code snippets when helpful. Add enthusiastic emoji flair (🚀, 💡, 💻, ✨)!`;

// Helper for smart fallback responses
function getSmartFallbackReply(message: string, contextCode?: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('review') || lower.includes('inspect') || contextCode) {
    return "### 💡 Code Review & Recommendations\n\nLooking at your website code:\n- **Structure & Markup:** Your elements are structured logically! Semantic tags like `<header>`, `<main>`, and `<button>` give your page clear accessibility.\n- **CSS Styling:** Good use of colors and layouts. Try adding `transition: transform 0.2s ease, box-shadow 0.2s ease;` to your interactive buttons or cards for a smooth, tactile hover effect!\n- **Responsive Tip:** Ensure you have `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">` and use `box-sizing: border-box;` so elements adapt seamlessly to mobile screens.\n\nKeep building! You can test updates in the Code Playground right away! 🚀";
  }
  if (lower.includes('flexbox') || lower.includes('center') || lower.includes('align')) {
    return "### 🌀 Flexbox Quick Guide\n\nTo center elements horizontally and vertically with CSS Flexbox:\n\n```css\n.container {\n  display: flex;\n  justify-content: center; /* Horizontally center */\n  align-items: center;     /* Vertically center */\n  gap: 1rem;               /* Space between items */\n}\n```\n\n- `justify-content` aligns along the main axis (row or column).\n- `align-items` aligns along the cross axis.\n- `flex-wrap: wrap` lets items wrap on smaller screens!";
  }
  if (lower.includes('meet') || lower.includes('class') || lower.includes('lesson')) {
    return "### 📹 Google Meet Live Classes\n\nYou can view all scheduled live classes under the **'Live Classes'** tab on the navigation bar! Click **'RSVP'** to reserve your spot (+100 XP) and use the **'Join Google Meet'** button when class starts to code along live with your instructor.";
  }
  if (lower.includes('league') || lower.includes('rank') || lower.includes('xp')) {
    return "### 🏆 Leagues & Ranks Guide\n\nDevNest features 6 competitive leagues: **Bronze 🥉 -> Silver 🥈 -> Gold 🥇 -> Platinum 💠 -> Diamond 💎 -> Master 👑**.\n\nYou earn XP by:\n1. Completing course coding challenges (+100 XP)\n2. Attending or RSVPing for Google Meet classes (+100 XP)\n3. Building projects in the Playground (+50 XP)\n4. Collaborating with classmates in chat (+25 XP)\n\nThe top 3 students on the leaderboard get promoted every Sunday!";
  }
  return "### 🚀 DevNest Web Helper\n\nI'm Byte, your coding companion! Here are three quick tips to level up your website:\n1. **Semantic HTML:** Always prefer `<button>`, `<nav>`, `<article>` over generic `<div>`s for better accessibility.\n2. **CSS Layouts:** Use `display: grid` for 2D page layouts and `display: flex` for 1D toolbars and cards.\n3. **Google Meet:** Check the **Live Classes** tab to join today's hands-on workshop!\n\nWhat specific part of your code would you like help with? ✨";
}

// Chatbot API Endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, contextCode } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const isValidKey = process.env.GEMINI_API_KEY && 
      process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' && 
      process.env.GEMINI_API_KEY.trim().length > 15;

    if (!isValidKey || !ai) {
      return res.json({
        reply: getSmartFallbackReply(message, contextCode),
        modelUsed: 'offline-smart-fallback',
        isFallback: true,
      });
    }

    // Prepare contents with context
    let promptContents = message;
    if (contextCode) {
      promptContents = `Student's current website code snippet:\n\`\`\`\n${contextCode}\n\`\`\`\n\nStudent question:\n${message}`;
    }

    // Call Gemini API using gemini-3.8-flash with generous 25s timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('AI Request Timeout')), 25000)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptContents,
      config: {
        systemInstruction: BYTE_SYSTEM_INSTRUCTION,
      },
    });

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;
    const reply = response.text || getSmartFallbackReply(message, contextCode);

    return res.json({ reply, modelUsed: 'gemini-3.8-flash' });
  } catch (err: any) {
    // Graceful fallback on network glitch or timeout: never crash with 500
    const fallbackText = getSmartFallbackReply(req.body?.message || '', req.body?.contextCode);
    return res.json({
      reply: fallbackText,
      modelUsed: 'fallback-assistant',
      isFallback: true,
      note: err?.message || 'Handled with fallback',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DevNest server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
