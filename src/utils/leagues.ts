export interface LeagueTier {
  id: string;
  name: string;
  rankLevel: number;
  minXP: number;
  maxXP: number;
  badgeIcon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  perks: string[];
}

export const LEAGUE_TIERS: LeagueTier[] = [
  {
    id: 'bronze',
    name: 'Bronze League',
    rankLevel: 1,
    minXP: 0,
    maxXP: 499,
    badgeIcon: '🥉',
    color: 'text-amber-700 dark:text-amber-500',
    bgColor: 'bg-amber-100 dark:bg-amber-950/40',
    borderColor: 'border-amber-400 dark:border-amber-700',
    perks: ['Access to HTML basics', 'Join live Google Meet sessions', 'Access to general chat'],
  },
  {
    id: 'silver',
    name: 'Silver League',
    rankLevel: 2,
    minXP: 500,
    maxXP: 1499,
    badgeIcon: '🥈',
    color: 'text-slate-600 dark:text-slate-300',
    bgColor: 'bg-slate-200 dark:bg-slate-800',
    borderColor: 'border-slate-400 dark:border-slate-600',
    perks: ['Unlock CSS Flexbox & Grid workshops', 'Custom profile border badge', 'Interactive playgrounds'],
  },
  {
    id: 'gold',
    name: 'Gold League',
    rankLevel: 3,
    minXP: 1500,
    maxXP: 2999,
    badgeIcon: '🥇',
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-950/40',
    borderColor: 'border-yellow-400 dark:border-yellow-600',
    perks: ['JavaScript DOM masterclasses', 'Priority Q&A in Google Meet', 'Unlock exclusive avatar items'],
  },
  {
    id: 'platinum',
    name: 'Platinum League',
    rankLevel: 4,
    minXP: 3000,
    maxXP: 4999,
    badgeIcon: '💠',
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-100 dark:bg-cyan-950/40',
    borderColor: 'border-cyan-400 dark:border-cyan-600',
    perks: ['React & Component deep dives', 'Host student project rooms', 'Platinum badge showcase'],
  },
  {
    id: 'diamond',
    name: 'Diamond League',
    rankLevel: 5,
    minXP: 5000,
    maxXP: 7999,
    badgeIcon: '💎',
    color: 'text-sky-600 dark:text-sky-400',
    bgColor: 'bg-sky-100 dark:bg-sky-950/40',
    borderColor: 'border-sky-400 dark:border-sky-600',
    perks: ['Full-stack website architectures', '1-on-1 mentor code reviews', 'Diamond league aura'],
  },
  {
    id: 'master',
    name: 'Master League',
    rankLevel: 6,
    minXP: 8000,
    maxXP: 999999,
    badgeIcon: '👑',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-950/40',
    borderColor: 'border-purple-400 dark:border-purple-600',
    perks: ['Mentor status in community chat', 'Exclusive Master badge & flair', 'Hall of Fame spot'],
  },
];

export function getLeagueByXP(xp: number, customTiers: LeagueTier[] = LEAGUE_TIERS): LeagueTier {
  const safeXp = Math.max(0, xp);
  for (let i = customTiers.length - 1; i >= 0; i--) {
    if (safeXp >= customTiers[i].minXP) {
      return customTiers[i];
    }
  }
  return customTiers[0];
}

export function calculateProgressToNextLeague(xp: number, customTiers: LeagueTier[] = LEAGUE_TIERS): {
  currentTier: LeagueTier;
  nextTier: LeagueTier | null;
  xpInCurrentTier: number;
  xpNeededForNext: number;
  percentage: number;
} {
  const currentTier = getLeagueByXP(xp, customTiers);
  const currentIndex = customTiers.findIndex(t => t.id === currentTier.id);
  const nextTier = currentIndex < customTiers.length - 1 ? customTiers[currentIndex + 1] : null;

  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      xpInCurrentTier: xp - currentTier.minXP,
      xpNeededForNext: 0,
      percentage: 100,
    };
  }

  const range = nextTier.minXP - currentTier.minXP;
  const currentProgress = xp - currentTier.minXP;
  const percentage = Math.min(100, Math.max(0, Math.round((currentProgress / range) * 100)));
  const xpNeededForNext = Math.max(0, nextTier.minXP - xp);

  return {
    currentTier,
    nextTier,
    xpInCurrentTier: currentProgress,
    xpNeededForNext,
    percentage,
  };
}

export function calculateStreakMultiplier(streakDays: number): number {
  if (streakDays >= 14) return 2.0;
  if (streakDays >= 7) return 1.5;
  if (streakDays >= 3) return 1.2;
  return 1.0;
}
