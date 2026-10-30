export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'community' | 'streaks' | 'achievement';
  unlockedAt?: string;
  isUnlocked: boolean;
  xpReward: number;
}

export interface UserStats {
  lessonsCompleted: number;
  meetSessionsJoined: number;
  chatMessagesSent: number;
  streakDays: number;
  playgroundProjectsRun: number;
  totalXP: number;
}

export const ALL_BADGES: Omit<Badge, 'isUnlocked' | 'unlockedAt'>[] = [
  {
    id: 'first_step',
    title: 'First Code Created',
    description: 'Ran your first HTML & CSS code in the interactive Playground',
    icon: '🌱',
    category: 'learning',
    xpReward: 50,
  },
  {
    id: 'meet_pioneer',
    title: 'Meet Pioneer',
    description: 'RSVPed or joined your first live Google Meet coding workshop',
    icon: '📹',
    category: 'learning',
    xpReward: 100,
  },
  {
    id: 'collab_hero',
    title: 'Collaboration Spark',
    description: 'Shared an idea or code snippet in the Student Collab Chat',
    icon: '💬',
    category: 'community',
    xpReward: 75,
  },
  {
    id: 'streak_flame',
    title: 'Streak Fire',
    description: 'Kept a 3-day daily coding activity streak going',
    icon: '🔥',
    category: 'streaks',
    xpReward: 150,
  },
  {
    id: 'css_wizard',
    title: 'CSS Stylist',
    description: 'Completed the Responsive Web Design card project',
    icon: '🎨',
    category: 'learning',
    xpReward: 120,
  },
  {
    id: 'league_climber',
    title: 'Silver Achiever',
    description: 'Crossed 500 XP to rise into the Silver League',
    icon: '🥈',
    category: 'achievement',
    xpReward: 200,
  },
  {
    id: 'playground_creator',
    title: 'Web Architect',
    description: 'Created 3 live website experiments in the Playground',
    icon: '🚀',
    category: 'achievement',
    xpReward: 150,
  },
];

export function evaluateBadges(stats: UserStats, unlockedBadgeIds: string[] = []): {
  badges: Badge[];
  newlyUnlocked: Badge[];
} {
  const newlyUnlocked: Badge[] = [];
  const badges: Badge[] = ALL_BADGES.map(badgeDef => {
    let shouldUnlock = unlockedBadgeIds.includes(badgeDef.id);

    if (!shouldUnlock) {
      switch (badgeDef.id) {
        case 'first_step':
          shouldUnlock = stats.playgroundProjectsRun >= 1 || stats.lessonsCompleted >= 1;
          break;
        case 'meet_pioneer':
          shouldUnlock = stats.meetSessionsJoined >= 1;
          break;
        case 'collab_hero':
          shouldUnlock = stats.chatMessagesSent >= 1;
          break;
        case 'streak_flame':
          shouldUnlock = stats.streakDays >= 3;
          break;
        case 'css_wizard':
          shouldUnlock = stats.lessonsCompleted >= 2;
          break;
        case 'league_climber':
          shouldUnlock = stats.totalXP >= 500;
          break;
        case 'playground_creator':
          shouldUnlock = stats.playgroundProjectsRun >= 3;
          break;
      }

      if (shouldUnlock && !unlockedBadgeIds.includes(badgeDef.id)) {
        newlyUnlocked.push({
          ...badgeDef,
          isUnlocked: true,
          unlockedAt: new Date().toISOString(),
        });
      }
    }

    return {
      ...badgeDef,
      isUnlocked: shouldUnlock,
      unlockedAt: shouldUnlock ? new Date().toISOString() : undefined,
    };
  });

  return { badges, newlyUnlocked };
}
