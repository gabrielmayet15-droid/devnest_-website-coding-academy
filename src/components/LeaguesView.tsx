import React from 'react';
import { 
  Trophy, 
  Flame, 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle, 
  ShieldAlert, 
  Crown,
  Medal
} from 'lucide-react';
import { UserProfile, StudentProgressRecord } from '../types';
import { LeagueTier, calculateProgressToNextLeague, getLeagueByXP } from '../utils/leagues';

interface LeaguesViewProps {
  user: UserProfile;
  students: StudentProgressRecord[];
  customTiers: LeagueTier[];
  onOpenAdminLeagues?: () => void;
}

export const LeaguesView: React.FC<LeaguesViewProps> = ({
  user,
  students,
  customTiers,
  onOpenAdminLeagues,
}) => {
  const progress = calculateProgressToNextLeague(user.xp, customTiers);
  const currentTier = progress.currentTier;
  const nextTier = progress.nextTier;

  // Sort students by XP for the leaderboard
  const sortedStudents = [...students].sort((a, b) => b.xp - a.xp);

  return (
    <div className="space-y-8">
      {/* Current Rank Banner */}
      <div className={`rounded-2xl p-6 sm:p-8 border shadow-lg ${currentTier.bgColor} ${currentTier.borderColor} relative overflow-hidden`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-md flex items-center justify-center text-4xl border border-white/40">
              {currentTier.badgeIcon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Your Current League
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/70 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700">
                  Tier {currentTier.rankLevel} of {customTiers.length}
                </span>
              </div>
              <h1 className={`text-2xl sm:text-3xl font-extrabold ${currentTier.color}`}>
                {currentTier.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                You have earned <strong className="font-bold text-slate-900 dark:text-white">{user.xp} XP</strong> across lessons, live meets, and coding projects!
              </p>
            </div>
          </div>

          {/* Progress bar to next tier */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur p-4 rounded-xl border border-white/50 dark:border-slate-800 min-w-[280px]">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>{nextTier ? `Progress to ${nextTier.name.split(' ')[0]}` : 'Max League Mastered!'}</span>
              <span>{progress.percentage}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center justify-between">
              <span>{progress.xpInCurrentTier} XP in tier</span>
              {nextTier ? (
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {progress.xpNeededForNext} XP to promote
                </span>
              ) : (
                <span className="font-semibold text-purple-500">Champion Status 👑</span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 2-Column Split: League Tiers Ladder & Weekly Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: All League Tiers & Perks (2 cols wide) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                League Ranks & Perks
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Level up by completing challenges and attending live Google Meet classes
              </p>
            </div>

            {onOpenAdminLeagues && (
              <button
                onClick={onOpenAdminLeagues}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                Configure Leagues (Admin)
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {customTiers.map((tier) => {
              const isCurrent = tier.id === currentTier.id;
              const isPassed = user.xp > tier.maxXP;

              return (
                <div
                  key={tier.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                      : isPassed
                      ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-90'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{tier.badgeIcon}</span>
                      <div>
                        <h3 className={`font-bold text-sm ${tier.color}`}>
                          {tier.name}
                        </h3>
                        <span className="text-[10px] text-slate-400">
                          {tier.minXP.toLocaleString()} - {tier.maxXP === 999999 ? '∞' : tier.maxXP.toLocaleString()} XP
                        </span>
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        Current Rank
                      </span>
                    )}
                    {isPassed && (
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Unlocked
                      </span>
                    )}
                  </div>

                  {/* Perks list */}
                  <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                    {tier.perks.map((perk, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                        <Sparkles className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Weekly Leaderboard */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span>Weekly Leaderboard</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Live
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Top 3 students get promoted to the next league every Sunday!
            </p>

            <div className="space-y-2">
              {sortedStudents.slice(0, 7).map((student, index) => {
                const isMe = student.id === user.id;
                const studentLeague = getLeagueByXP(student.xp, customTiers);

                return (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                      isMe
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 font-bold'
                        : index === 0
                        ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                        : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 text-center font-bold text-xs ${
                        index === 0 ? 'text-yellow-500 font-extrabold' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-amber-700' : 'text-slate-400'
                      }`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                      </span>

                      <span className="text-base">{student.avatar}</span>

                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-1">
                          <span>{student.name}</span>
                          {isMe && <span className="text-[10px] text-indigo-600 dark:text-indigo-400">(You)</span>}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {studentLeague.badgeIcon} {studentLeague.name.split(' ')[0]}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-extrabold text-indigo-600 dark:text-indigo-400">
                        {student.xp} XP
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-amber-500 justify-end">
                        <Flame className="w-3 h-3 fill-amber-500" />
                        <span>{student.streakDays}d streak</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 text-center">
            Promotions calculate every Sunday at 11:59 PM UTC
          </div>
        </div>

      </div>
    </div>
  );
};
