import { LeagueTier } from '../utils/leagues';
import { Badge } from '../utils/badges';

export interface DailyActivity {
  day: string; // 'Mon', 'Tue', etc.
  fullDate: string; // '2026-10-26'
  xpEarned: number;
  targetXp: number;
  lessonsCompleted: number;
  completed: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  avatarBg: string;
  title: string;
  bio: string;
  statusMessage: string;
  themeAura: string;
  xp: number;
  streakDays: number;
  lastActive: string;
  role: 'student' | 'admin';
  pinnedBadgeIds: string[];
  completedLessonIds: string[];
  registeredMeetSessionIds: string[];
  createdProjectCount: number;
  weeklyStreak?: DailyActivity[];
}

export interface GoogleMeetSession {
  id: string;
  title: string;
  topic: string;
  description: string;
  courseId: string;
  meetUrl: string;
  scheduledTime: string; // ISO string
  durationMinutes: number;
  instructorName: string;
  instructorAvatar: string;
  instructorTitle: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  attendeeCount: number;
  maxCapacity: number;
  agenda: string[];
  starterCodeSnippet?: string;
  recordingUrl?: string;
  isPast?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  starterHtml: string;
  starterCss: string;
  starterJs: string;
  instructions: string[];
  xpReward: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'HTML & CSS' | 'Responsive Design' | 'JavaScript' | 'Components' | 'Fullstack';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  totalLessons: number;
  xpTotal: number;
  icon: string;
  color: string;
  modules: CourseModule[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderLeagueId: string;
  senderTitle: string;
  channelId: string;
  text: string;
  codeSnippet?: {
    language: 'html' | 'css' | 'javascript';
    code: string;
  };
  timestamp: string;
  reactions: { emoji: string; count: number; users: string[] }[];
}

export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  icon: string;
  topic: string;
}

export interface StudentProgressRecord {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string;
  xp: number;
  leagueId: string;
  completedLessonsCount: number;
  meetSessionsCount: number;
  streakDays: number;
  lastActive: string;
  notes?: string;
}
