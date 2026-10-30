import { Course, GoogleMeetSession, ChatChannel, ChatMessage, StudentProgressRecord, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr_guest',
  name: 'New Student',
  username: 'new_coder',
  email: '',
  avatar: '🌱',
  avatarBg: 'from-emerald-400 to-teal-600',
  title: 'HTML Pioneer 🌱',
  bio: 'Starting my website creation journey with DevNest!',
  statusMessage: 'Ready to build my very first website! 💻',
  themeAura: 'indigo',
  xp: 0, // Starts from the beginning at 0 XP!
  streakDays: 1,
  lastActive: 'Just now',
  role: 'student',
  pinnedBadgeIds: [], // Zero pre-earned badges
  completedLessonIds: [], // Zero completed lessons
  registeredMeetSessionIds: [],
  createdProjectCount: 0,
};

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course_html_css',
    title: 'HTML & CSS Fundamentals',
    description: 'Learn semantic markup, modern CSS layouts, flexbox, and typography to build your first portfolio.',
    category: 'HTML & CSS',
    level: 'Beginner',
    totalLessons: 4,
    xpTotal: 400,
    icon: '🌐',
    color: 'from-blue-500 to-indigo-600',
    modules: [
      {
        id: 'html_101_1',
        title: 'Semantic HTML5 & Page Structure',
        description: 'Understand header, nav, main, section, and footer elements for accessible websites.',
        durationMinutes: 25,
        starterHtml: `<header class="hero">
  <h1>Welcome to My First Website!</h1>
  <p>Learning web development step by step with DevNest.</p>
</header>
<main class="content">
  <div class="card">
    <h2>About Me</h2>
    <p>I love designing sleek, modern websites with clean code!</p>
    <button class="action-btn" id="helloBtn">Say Hello 👋</button>
  </div>
</main>`,
        starterCss: `body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #f8fafc;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
.hero {
  text-align: center;
  margin-bottom: 2rem;
}
.hero h1 {
  color: #1e1b4b;
  font-size: 2rem;
  margin: 0;
}
.hero p {
  color: #64748b;
}
.card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 380px;
}
.action-btn {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.action-btn:hover {
  background: #4338ca;
  transform: translateY(-2px);
}`,
        starterJs: `document.getElementById('helloBtn').addEventListener('click', () => {
  alert('Welcome to the web coding world! 🚀');
});`,
        instructions: [
          'Add a new <h3> element inside .card detailing your favorite hobby',
          'Change the background gradient in the CSS',
          'Run the code and verify the interactive click alert!',
        ],
        xpReward: 100,
      },
      {
        id: 'css_101_1',
        title: 'Mastering Flexbox & Alignment',
        description: 'Master justifyContent, alignItems, flexWrap, and gap to build responsive navbars and grids.',
        durationMinutes: 30,
        starterHtml: `<div class="navbar">
  <div class="logo">⚡ DevNest</div>
  <div class="nav-links">
    <a href="#home">Home</a>
    <a href="#projects">Projects</a>
    <a href="#about">About</a>
  </div>
  <button class="join-btn">Sign In</button>
</div>`,
        starterCss: `.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #0f172a;
  color: white;
  border-radius: 12px;
}
.logo {
  font-weight: 800;
  font-size: 1.25rem;
  color: #38bdf8;
}
.nav-links {
  display: flex;
  gap: 1.5rem;
}
.nav-links a {
  color: #cbd5e1;
  text-decoration: none;
  font-weight: 500;
}
.join-btn {
  background: #38bdf8;
  color: #0f172a;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}`,
        starterJs: `console.log('Flexbox navbar loaded successfully!');`,
        instructions: [
          'Change the justify-content property to space-around',
          'Add a hover transition effect to the navigation links',
        ],
        xpReward: 120,
      },
      {
        id: 'html_101_3',
        title: 'Responsive Grid Layouts',
        description: 'Create multi-column responsive galleries that adapt smoothly to mobile and desktop screens.',
        durationMinutes: 35,
        starterHtml: `<div class="gallery">
  <div class="card card-1">Project 1</div>
  <div class="card card-2">Project 2</div>
  <div class="card card-3">Project 3</div>
  <div class="card card-4">Project 4</div>
</div>`,
        starterCss: `.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}
.card {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: white;
  padding: 3rem 1rem;
  border-radius: 16px;
  text-align: center;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}`,
        starterJs: ``,
        instructions: [
          'Add a hover scaling effect to each card item',
          'Add custom descriptions underneath each project name',
        ],
        xpReward: 100,
      },
      {
        id: 'html_101_4',
        title: 'Forms, Inputs & Validation UI',
        description: 'Style modern text inputs, checkboxes, and interactive submit buttons with error states.',
        durationMinutes: 30,
        starterHtml: `<form class="subscribe-form" id="regForm">
  <h2>Join DevNest Club</h2>
  <input type="text" placeholder="Your Name" required class="input-field" />
  <input type="email" placeholder="Your Email" required class="input-field" />
  <button type="submit" class="submit-btn">Register Free</button>
</form>`,
        starterCss: `.subscribe-form {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  max-width: 320px;
  margin: 2rem auto;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.input-field {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
}
.input-field:focus {
  border-color: #6366f1;
}
.submit-btn {
  background: #6366f1;
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}`,
        starterJs: `document.getElementById('regForm').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Success! You are registered.');
});`,
        instructions: [
          'Add validation style when the input is focused',
          'Add a reset button with ghost styling',
        ],
        xpReward: 80,
      },
    ],
  },
  {
    id: 'course_js_interactivity',
    title: 'JavaScript Web Interactivity',
    description: 'Learn DOM manipulation, event listeners, API fetching, and local storage to make your sites alive.',
    category: 'JavaScript',
    level: 'Intermediate',
    totalLessons: 3,
    xpTotal: 450,
    icon: '⚡',
    color: 'from-amber-500 to-yellow-600',
    modules: [
      {
        id: 'js_201_1',
        title: 'DOM Querying & Dynamic Updates',
        description: 'Change innerHTML, toggle CSS classes, and manipulate DOM nodes dynamically.',
        durationMinutes: 30,
        starterHtml: `<div class="counter-box">
  <h2 id="countDisplay">0</h2>
  <div class="btn-group">
    <button id="decBtn">-</button>
    <button id="incBtn">+</button>
    <button id="resetBtn">Reset</button>
  </div>
</div>`,
        starterCss: `.counter-box {
  text-align: center;
  font-family: sans-serif;
  padding: 2rem;
}
#countDisplay {
  font-size: 4rem;
  color: #4f46e5;
  margin: 0.5rem 0;
}
.btn-group button {
  padding: 0.5rem 1.25rem;
  margin: 0 0.25rem;
  font-size: 1.25rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  cursor: pointer;
}`,
        starterJs: `let count = 0;
const display = document.getElementById('countDisplay');
document.getElementById('incBtn').onclick = () => { count++; display.innerText = count; };
document.getElementById('decBtn').onclick = () => { count--; display.innerText = count; };
document.getElementById('resetBtn').onclick = () => { count = 0; display.innerText = count; };`,
        instructions: [
          'Add color changing logic: green when count > 0, red when count < 0',
          'Add audio beep or vibration feedback',
        ],
        xpReward: 150,
      },
    ],
  },
];

export const INITIAL_MEET_SESSIONS: GoogleMeetSession[] = [
  {
    id: 'meet_1',
    title: 'Live Workshop: Build Your Personal Portfolio Card',
    topic: 'Hands-on live coding session with live Q&A and screen-sharing reviews.',
    description: 'Join your Teacher & Admin on Google Meet as we code a portfolio card featuring glassmorphism, responsive tags, and animated social links. Perfect for beginners!',
    courseId: 'course_html_css',
    meetUrl: 'https://meet.google.com/ais-web-devn',
    scheduledTime: new Date(Date.now() + 1000 * 60 * 45).toISOString(), // 45 mins from now
    durationMinutes: 60,
    instructorName: 'Admin (DevNest Lead Teacher)',
    instructorAvatar: '🛡️',
    instructorTitle: 'DevNest Academy Lead Teacher & Admin',
    level: 'Beginner',
    attendeeCount: 18,
    maxCapacity: 30,
    agenda: [
      'Welcome & Icebreaker (5 mins)',
      'HTML markup breakdown: Avatars, tags, and bio (15 mins)',
      'CSS Styling: Modern drop shadows, gradient borders (20 mins)',
      'Interactive JavaScript: Contact modal & copy email link (10 mins)',
      'Live Student Code Review & Q&A (10 mins)',
    ],
    starterCodeSnippet: `<!-- Google Meet Starter Code -->\n<div class="profile-card">\n  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" class="avatar" />\n  <h3>Alex Chen</h3>\n  <p class="role">Frontend Explorer</p>\n</div>`,
  },
  {
    id: 'meet_2',
    title: 'CSS Flexbox & Responsive Navbar Deep-Dive',
    topic: 'Live Google Meet session on mastering mobile menus and responsive breakpoints.',
    description: 'Struggling with hamburger menus or flex items shrinking? Join Admin for an interactive session where we fix common responsive layout mistakes live.',
    courseId: 'course_html_css',
    meetUrl: 'https://meet.google.com/dev-nest-live',
    scheduledTime: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(), // Tomorrow
    durationMinutes: 75,
    instructorName: 'Admin (DevNest Lead Teacher)',
    instructorAvatar: '🛡️',
    instructorTitle: 'DevNest Academy Lead Teacher & Admin',
    level: 'Intermediate',
    attendeeCount: 14,
    maxCapacity: 25,
    agenda: [
      'Flexbox axis mental model',
      'Media queries and mobile-first rules',
      'Coding a slide-out drawer menu in 20 lines of JS',
      'Debugging peer layout bugs live with Admin',
    ],
  },
  {
    id: 'meet_3',
    title: 'JavaScript DOM Game Workshop: Clicker Game',
    topic: 'Creating a mini browser game from scratch in 60 minutes.',
    description: 'Learn event handling, intervals, score state, and sound effects as we build an interactive mini web game together with Admin.',
    courseId: 'course_js_interactivity',
    meetUrl: 'https://meet.google.com/gem-code-room',
    scheduledTime: new Date(Date.now() + 1000 * 60 * 60 * 52).toISOString(),
    durationMinutes: 60,
    instructorName: 'Admin (DevNest Lead Teacher)',
    instructorAvatar: '🛡️',
    instructorTitle: 'DevNest Academy Lead Teacher & Admin',
    level: 'Beginner',
    attendeeCount: 22,
    maxCapacity: 35,
    agenda: [
      'Game loop fundamentals in JavaScript',
      'DOM animations with CSS transitions',
      'High score persistence with localStorage',
    ],
  },
  {
    id: 'meet_past_1',
    title: 'Mastering Semantic HTML5 & SEO Foundations',
    topic: 'Archived Google Meet session with recap notes and code templates.',
    description: 'Watch the full recording and review the annotated starter files taught by Admin from our beginner web kickoff class.',
    courseId: 'course_html_css',
    meetUrl: 'https://meet.google.com/archive-html5',
    scheduledTime: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    durationMinutes: 60,
    instructorName: 'Admin (DevNest Lead Teacher)',
    instructorAvatar: '🛡️',
    instructorTitle: 'DevNest Academy Lead Teacher & Admin',
    level: 'Beginner',
    attendeeCount: 29,
    maxCapacity: 30,
    agenda: ['HTML headings & landmark tags', 'Meta tags & OpenGraph preview', 'Accessible forms'],
    recordingUrl: 'https://meet.google.com/recordings/devnest-html5-kickoff',
    isPast: true,
  },
];

export const INITIAL_CHANNELS: ChatChannel[] = [
  {
    id: 'general',
    name: 'general-lobby',
    description: 'General chat for all coding students to hang out and share updates',
    icon: '💬',
    topic: 'Welcome new coders! Say hi and share what website you want to build!',
  },
  {
    id: 'portfolio-collab',
    name: 'portfolio-collab',
    description: 'Collaborate with peers on personal portfolios & review designs',
    icon: '🚀',
    topic: 'Share your work in progress and give friendly design feedback!',
  },
  {
    id: 'bug-squash',
    name: 'bug-squash-help',
    description: 'Need help fixing a broken layout or JS bug? Post your snippet here',
    icon: '🐛',
    topic: 'Post HTML/CSS snippets for peer debugging and tips',
  },
  {
    id: 'meet-backchannel',
    name: 'live-meet-backchannel',
    description: 'Live chat during Google Meet classes to ask questions without interrupting audio',
    icon: '📹',
    topic: 'Drop questions for the instructor during active Google Meet classes',
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    senderId: 'usr_maya',
    senderName: 'Maya Tanaka',
    senderAvatar: '🌸',
    senderLeagueId: 'gold',
    senderTitle: 'Layout Artisan ✨',
    channelId: 'general',
    text: 'Hey everyone! Excited for the Google Meet live workshop today on portfolio cards! Anyone else attending?',
    timestamp: '10 mins ago',
    reactions: [
      { emoji: '🔥', count: 4, users: ['usr_me', 'usr_liam', 'usr_kai', 'usr_noah'] },
      { emoji: '👋', count: 3, users: ['usr_me', 'usr_chloe', 'usr_liam'] },
    ],
  },
  {
    id: 'msg_2',
    senderId: 'usr_liam',
    senderName: 'Liam Vance',
    senderAvatar: '⚡',
    senderLeagueId: 'silver',
    senderTitle: 'Bug Hunter 🔍',
    channelId: 'general',
    text: 'Yes! I just got promoted to Silver League and unlocked the Flexbox masterclasses. Here is a quick CSS snippet I wrote for animated glowing text:',
    codeSnippet: {
      language: 'css',
      code: `.glow-text {\n  color: #fff;\n  text-shadow: 0 0 10px #6366f1, 0 0 20px #818cf8;\n  animation: pulse 2s infinite alternate;\n}`,
    },
    timestamp: '7 mins ago',
    reactions: [
      { emoji: '💡', count: 5, users: ['usr_me', 'usr_maya', 'usr_chloe', 'usr_kai', 'usr_noah'] },
      { emoji: '🚀', count: 2, users: ['usr_me', 'usr_maya'] },
    ],
  },
  {
    id: 'msg_3',
    senderId: 'usr_chloe',
    senderName: 'Chloe Bennett',
    senderAvatar: '🎨',
    senderLeagueId: 'gold',
    senderTitle: 'Color Theorist 🖌️',
    channelId: 'portfolio-collab',
    text: 'Working on a dark-mode website template for independent artists. Does anyone want to team up to build the interactive photo grid?',
    timestamp: '25 mins ago',
    reactions: [{ emoji: '🤝', count: 3, users: ['usr_me', 'usr_maya', 'usr_liam'] }],
  },
  {
    id: 'msg_4',
    senderId: 'usr_kai',
    senderName: 'Kai Sato',
    senderAvatar: '🤖',
    senderLeagueId: 'platinum',
    senderTitle: 'DOM Master ⚡',
    channelId: 'bug-squash',
    text: 'Quick tip for beginners: if your elements are overflowing horizontally on mobile, remember to add `box-sizing: border-box;` and check for fixed pixel widths!',
    codeSnippet: {
      language: 'css',
      code: `* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}`,
    },
    timestamp: '1 hour ago',
    reactions: [{ emoji: '❤️', count: 6, users: ['usr_me', 'usr_maya', 'usr_liam', 'usr_chloe', 'usr_noah', 'usr_zoe'] }],
  },
];

export const INITIAL_STUDENTS_PROGRESS: StudentProgressRecord[] = [
  {
    id: 'usr_kai',
    name: 'Kai Sato',
    email: 'kai.sato@code.edu',
    avatar: '🤖',
    title: 'DOM Master ⚡',
    xp: 3420,
    leagueId: 'platinum',
    completedLessonsCount: 8,
    meetSessionsCount: 7,
    streakDays: 14,
    lastActive: '5 mins ago',
    notes: 'Exceptional progress in JavaScript event delegation and component state.',
  },
  {
    id: 'usr_maya',
    name: 'Maya Tanaka',
    email: 'maya.t@code.edu',
    avatar: '🌸',
    title: 'Layout Artisan ✨',
    xp: 2150,
    leagueId: 'gold',
    completedLessonsCount: 6,
    meetSessionsCount: 5,
    streakDays: 9,
    lastActive: '10 mins ago',
    notes: 'Outstanding responsive CSS design and high community collaboration.',
  },
  {
    id: 'usr_chloe',
    name: 'Chloe Bennett',
    email: 'chloe.b@code.edu',
    avatar: '🎨',
    title: 'Color Theorist 🖌️',
    xp: 1840,
    leagueId: 'gold',
    completedLessonsCount: 5,
    meetSessionsCount: 4,
    streakDays: 6,
    lastActive: '25 mins ago',
    notes: 'Strong portfolio projects with custom dark/light palettes.',
  },
  {
    id: 'usr_liam',
    name: 'Liam Vance',
    email: 'liam.v@code.edu',
    avatar: '⚡',
    title: 'Bug Hunter 🔍',
    xp: 890,
    leagueId: 'silver',
    completedLessonsCount: 3,
    meetSessionsCount: 2,
    streakDays: 4,
    lastActive: '7 mins ago',
    notes: 'Promoted to Silver League this week. Active in peer collaboration.',
  },
  {
    id: 'usr_me',
    name: 'Alex Rivera (You)',
    email: 'alex@example.com',
    avatar: '🦊',
    title: 'CSS Magician 🪄',
    xp: 680,
    leagueId: 'silver',
    completedLessonsCount: 2,
    meetSessionsCount: 1,
    streakDays: 4,
    lastActive: 'Active now',
    notes: 'Consistent daily streak! Ready for portfolio workshop.',
  },
  {
    id: 'usr_noah',
    name: 'Noah Patel',
    email: 'noah.p@code.edu',
    avatar: '🚀',
    title: 'HTML Pioneer 🌱',
    xp: 320,
    leagueId: 'bronze',
    completedLessonsCount: 1,
    meetSessionsCount: 1,
    streakDays: 2,
    lastActive: '2 hours ago',
    notes: 'New learner who completed semantic HTML5 foundations.',
  },
  {
    id: 'usr_zoe',
    name: 'Zoe Morales',
    email: 'zoe.m@code.edu',
    avatar: '🐱',
    title: 'Code Apprentice 📖',
    xp: 190,
    leagueId: 'bronze',
    completedLessonsCount: 1,
    meetSessionsCount: 0,
    streakDays: 1,
    lastActive: '4 hours ago',
    notes: 'Enrolled in beginner HTML & CSS fundamentals.',
  },
];

export const AVATAR_OPTIONS = [
  { emoji: '🦊', label: 'Fox' },
  { emoji: '🐱', label: 'Cat' },
  { emoji: '🤖', label: 'Robot' },
  { emoji: '🚀', label: 'Rocket' },
  { emoji: '🌸', label: 'Blossom' },
  { emoji: '⚡', label: 'Lightning' },
  { emoji: '🧙‍♂️', label: 'Wizard' },
  { emoji: '🎨', label: 'Artist' },
  { emoji: '🦄', label: 'Unicorn' },
  { emoji: '👾', label: 'Pixel Alien' },
  { emoji: '🐉', label: 'Dragon' },
  { emoji: '🧑‍💻', label: 'Coder' },
];

export const TITLE_OPTIONS = [
  'CSS Magician 🪄',
  'DOM Tamer ⚡',
  'Layout Artisan ✨',
  'Bug Hunter 🔍',
  'Flexbox Whisperer 🌀',
  'Color Theorist 🖌️',
  'Fullstack Voyager 🛸',
  'Pixel Perfectionist 📐',
  'HTML Pioneer 🌱',
  'Frontend Explorer 🔭',
];

export const THEME_AURAS = [
  { id: 'indigo', name: 'Electric Indigo', ringClass: 'ring-indigo-500', glowClass: 'shadow-indigo-500/25', gradient: 'from-indigo-500 to-purple-600' },
  { id: 'emerald', name: 'Cyber Emerald', ringClass: 'ring-emerald-500', glowClass: 'shadow-emerald-500/25', gradient: 'from-emerald-500 to-teal-600' },
  { id: 'amber', name: 'Solar Amber', ringClass: 'ring-amber-500', glowClass: 'shadow-amber-500/25', gradient: 'from-amber-500 to-orange-600' },
  { id: 'rose', name: 'Neon Rose', ringClass: 'ring-rose-500', glowClass: 'shadow-rose-500/25', gradient: 'from-rose-500 to-pink-600' },
  { id: 'cyan', name: 'Cosmic Cyan', ringClass: 'ring-cyan-500', glowClass: 'shadow-cyan-500/25', gradient: 'from-cyan-500 to-blue-600' },
  { id: 'violet', name: 'Mystic Violet', ringClass: 'ring-violet-500', glowClass: 'shadow-violet-500/25', gradient: 'from-violet-500 to-fuchsia-600' },
];
