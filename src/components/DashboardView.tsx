import React from 'react';
import { 
  Video, 
  Code2, 
  Trophy, 
  Flame, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  Users, 
  Clock, 
  Compass,
  Calendar,
  Trash2,
  ShieldCheck,
  Target,
  Zap
} from 'lucide-react';
import { UserProfile, GoogleMeetSession, Course } from '../types';
import { getLeagueByXP, calculateProgressToNextLeague, calculateStreakMultiplier, LeagueTier } from '../utils/leagues';
import { Badge } from '../utils/badges';
import { generateWeeklyActivityGrid, calculateWeeklyStats } from '../utils/streak';
import { ThreeDevArtifact } from './ThreeDevArtifact';

interface DashboardViewProps {
  user: UserProfile;
  nextMeetSession?: GoogleMeetSession;
  allMeetSessions?: GoogleMeetSession[];
  courses: Course[];
  badges: Badge[];
  customTiers: LeagueTier[];
  onNavigate: (tab: string) => void;
  onOpenPlayground: () => void;
  onOpenProfile: () => void;
  onCancelBooking?: (sessionId: string) => void;
  onCompleteDailyGoal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  nextMeetSession,
  allMeetSessions = [],
  courses,
  badges,
  customTiers,
  onNavigate,
  onOpenPlayground,
  onOpenProfile,
  onCancelBooking,
  onCompleteDailyGoal,
}) => {
  const currentLeague = getLeagueByXP(user.xp, customTiers);
  const progress = calculateProgressToNextLeague(user.xp, customTiers);
  const streakMultiplier = calculateStreakMultiplier(user.streakDays);

  const unlockedCount = badges.filter(b => b.isUnlocked).length;

  // Generate Weekly Activity Streak grid for current student
  const weeklyGrid = generateWeeklyActivityGrid(
    user.streakDays,
    user.xp,
    user.completedLessonIds.length
  );
  const weeklyStats = calculateWeeklyStats(weeklyGrid);
  const todayItem = weeklyGrid.find(d => d.isToday);

  // Filter booked sessions
  const bookedSessions = allMeetSessions.filter(s => 
    user.registeredMeetSessionIds.includes(s.id) && !s.isPast
  );

  return (
    <div className="space-y-8">
      {/* Student Welcome Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenProfile}
              aria-label="Open profile customization"
              className="relative group focus:outline-none"
            >
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${user.avatarBg} flex items-center justify-center text-3xl sm:text-4xl shadow-md group-hover:scale-105 transition-transform ring-4 ring-indigo-500/20`}>
                {user.avatar}
              </div>
              <span className="absolute -bottom-1 -right-1 text-xs px-1.5 py-0.5 rounded-full bg-slate-900 text-white font-bold">
                {currentLeague.badgeIcon}
              </span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Welcome back
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {user.title}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                {user.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-lg">
                "{user.statusMessage}"
              </p>
            </div>
          </div>

          {/* Quick Stat Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 min-w-[120px]">
              <div className="text-[10px] uppercase font-bold text-slate-400">Total XP</div>
              <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {user.xp} XP
              </div>
              <div className="text-[10px] text-slate-400">{currentLeague.name}</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 min-w-[120px]">
              <div className="text-[10px] uppercase font-bold text-slate-400">Coding Streak</div>
              <div className="text-xl font-extrabold text-amber-500 flex items-center gap-1">
                <Flame className="w-5 h-5 fill-amber-500" />
                <span>{user.streakDays} Days</span>
              </div>
              <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                {streakMultiplier}x XP Bonus Active!
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 min-w-[120px]">
              <div className="text-[10px] uppercase font-bold text-slate-400">Badges</div>
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {unlockedCount} / {badges.length}
              </div>
              <div className="text-[10px] text-slate-400">Earned</div>
            </div>
          </div>

        </div>

        {/* League Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span>{currentLeague.badgeIcon} {currentLeague.name}</span>
              <span className="text-slate-400 font-normal">→ Next Rank: {progress.nextTier?.name || 'Master'}</span>
            </div>
            <span className="text-indigo-600 dark:text-indigo-400">{progress.percentage}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* NEW: Weekly Activity Streak Visualization (Calendar Grid Format with Progress Bars for Daily Goals) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 dark:bg-amber-500/20">
                <Flame className="w-5 h-5 fill-amber-500" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Weekly Activity Streak</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 font-bold">
                    {user.streakDays}-Day Streak 🔥
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Daily Goal: Earn at least 50 XP from coding lessons, playground practice, or Google Meet live sessions
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {weeklyStats.metDays} of {weeklyStats.totalDays} Days Goal Met
              </div>
              <div className="text-[11px] text-slate-400">
                Weekly Completion: {weeklyStats.percentage}%
              </div>
            </div>

            {onCompleteDailyGoal && (!todayItem?.isGoalMet) && (
              <button
                onClick={onCompleteDailyGoal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-105 shrink-0"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-900" />
                <span>Complete Today's Goal (+50 XP)</span>
              </button>
            )}
          </div>
        </div>

        {/* 7-Day Calendar Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {weeklyGrid.map((day) => {
            return (
              <div
                key={day.dayName}
                className={`rounded-2xl p-3.5 border transition-all flex flex-col justify-between relative ${
                  day.isToday
                    ? 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                    : day.isGoalMet
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Header: Day & Date */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {day.dayName}
                    </span>
                    {day.isToday && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-indigo-600 text-white">
                        Today
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {day.formattedDate}
                  </div>
                </div>

                {/* Center Flame / Status Icon */}
                <div className="my-3 flex items-center justify-center">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-transform ${
                      day.isGoalMet
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-500 scale-110 shadow-sm'
                        : day.isToday
                        ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-60'
                    }`}
                  >
                    {day.isGoalMet ? '🔥' : day.isToday ? '🎯' : '💤'}
                  </div>
                </div>

                {/* Daily Goal Progress Bar */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[10px] font-semibold">
                    <span className="text-slate-500 dark:text-slate-400">
                      {day.xpEarned}/{day.targetXp} XP
                    </span>
                    <span className={day.isGoalMet ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-400'}>
                      {day.percentage}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        day.isGoalMet
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                          : 'bg-indigo-500'
                      }`}
                      style={{ width: `${day.percentage}%` }}
                    />
                  </div>

                  <div className="text-[9px] text-center font-bold text-slate-400">
                    {day.isGoalMet ? 'Goal Reached ✓' : day.isToday ? 'In Progress' : day.isPast ? 'Rest Day' : 'Upcoming'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booked Google Meet Courses / Classes Section */}
      {bookedSessions.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                My Booked Classes ({bookedSessions.length})
              </h2>
            </div>
            <button
              onClick={() => onNavigate('meets')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View All Live Classes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookedSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/60 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Teacher: Admin
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {session.durationMinutes} mins
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {session.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {session.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-indigo-100 dark:border-indigo-900/60">
                  <a
                    href={session.meetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Meet</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {onCancelBooking && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete your booked spot for "${session.title}"?`)) {
                          onCancelBooking(session.id);
                        }
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Booking</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3D Spatial Artifact & Featured Google Meet Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {nextMeetSession && (
          <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-indigo-800/50 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Upcoming Live Workshop
                </span>
                <span className="text-xs text-indigo-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {nextMeetSession.durationMinutes} mins on Google Meet
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
                {nextMeetSession.title}
              </h2>
              <p className="text-indigo-200 text-xs sm:text-sm mt-1 max-w-xl">
                {nextMeetSession.description}
              </p>

              <div className="flex items-center gap-3 mt-4 text-xs text-indigo-300">
                <span className="font-semibold text-white flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Teacher: Admin (Lead Instructor)
                </span>
                <span>•</span>
                <span>{nextMeetSession.attendeeCount} students attending</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-indigo-800/60 shrink-0">
              <button
                onClick={() => onNavigate('meets')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 transition-colors"
              >
                View Agenda & Details
              </button>

              <a
                href={nextMeetSession.meetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
              >
                <Video className="w-4 h-4" />
                <span>Join Google Meet</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Interactive 3D Spatial Trophy / Satellite Artifact */}
        <div className="lg:col-span-1">
          <ThreeDevArtifact className="h-full" />
        </div>
      </div>

      {/* 2-Column Section: Daily Coding Quests & Quick Launch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Daily Quests Card (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <span>Daily Coding Quests</span>
            </div>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Reset in 12h
            </span>
          </div>

          <div className="space-y-3">
            {/* Quest 1 */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Attend or RSVP to a Google Meet live class
                  </div>
                  <div className="text-[11px] text-slate-500">Live instruction & group Q&A with Admin</div>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0">
                +100 XP
              </span>
            </div>

            {/* Quest 2 */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Run and test a layout in the Playground
                  </div>
                  <div className="text-[11px] text-slate-500">Try changing button colors or flexbox properties</div>
                </div>
              </div>
              <button
                onClick={onOpenPlayground}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shrink-0"
              >
                Launch (+50 XP)
              </button>
            </div>

            {/* Quest 3 */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-600">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Share a snippet in Student Collab Chat
                  </div>
                  <div className="text-[11px] text-slate-500">Help a classmate or post your work-in-progress</div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('chat')}
                className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 transition-colors shrink-0"
              >
                Chat (+75 XP)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Badges Showcase */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span>Your Badges</span>
              </div>
              <button
                onClick={onOpenProfile}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Pin & Edit
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    badge.isUnlocked
                      ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 opacity-50 grayscale'
                  }`}
                >
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {badge.title}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                    {badge.isUnlocked ? 'Unlocked' : `+${badge.xpReward} XP`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 text-center">
            Complete lessons & streak quests to unlock all achievements
          </div>
        </div>

      </div>
    </div>
  );
};
