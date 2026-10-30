export interface DailyGoalProgress {
  dayName: string; // 'Mon', 'Tue', etc.
  dayShort: string; // 'M', 'T', 'W', etc.
  dayNumber: number; // e.g. 26, 27, 28
  formattedDate: string; // 'Oct 28'
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  xpEarned: number;
  targetXp: number;
  percentage: number;
  lessonsDone: number;
  targetLessons: number;
  isGoalMet: boolean;
}

export function generateWeeklyActivityGrid(
  streakDays: number = 1,
  todayXp: number = 0,
  todayLessonsCount: number = 0,
  referenceDate: Date = new Date()
): DailyGoalProgress[] {
  const result: DailyGoalProgress[] = [];
  const currentDayOfWeek = referenceDate.getDay(); // 0 is Sunday, 1 is Monday
  // Convert so Monday is 0, Sunday is 6
  const normalizedTodayIdx = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayShorts = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Find Monday of the current week
  const monday = new Date(referenceDate);
  const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  monday.setDate(referenceDate.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);

    const isToday = i === normalizedTodayIdx;
    const isPast = i < normalizedTodayIdx;
    const isFuture = i > normalizedTodayIdx;

    const targetXp = 50; // Standard daily goal: 50 XP
    const targetLessons = 1;

    let xpEarned = 0;
    let lessonsDone = 0;
    let isGoalMet = false;

    if (isToday) {
      xpEarned = todayXp;
      lessonsDone = todayLessonsCount;
      isGoalMet = xpEarned >= targetXp || lessonsDone >= targetLessons || (streakDays > 0 && xpEarned > 0);
    } else if (isPast) {
      // Days within the streak are marked as completed with goal met
      const daysAgo = normalizedTodayIdx - i;
      if (daysAgo < streakDays) {
        xpEarned = 50 + (daysAgo * 25) % 60;
        lessonsDone = 1;
        isGoalMet = true;
      } else {
        xpEarned = 0;
        lessonsDone = 0;
        isGoalMet = false;
      }
    } else {
      // Future days
      xpEarned = 0;
      lessonsDone = 0;
      isGoalMet = false;
    }

    const percentage = Math.min(100, Math.round((xpEarned / targetXp) * 100));

    result.push({
      dayName: dayNames[i],
      dayShort: dayShorts[i],
      dayNumber: dayDate.getDate(),
      formattedDate: dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isToday,
      isPast,
      isFuture,
      xpEarned,
      targetXp,
      percentage,
      lessonsDone,
      targetLessons,
      isGoalMet,
    });
  }

  return result;
}

export function calculateWeeklyStats(days: DailyGoalProgress[]) {
  const metDays = days.filter(d => d.isGoalMet).length;
  const totalDays = days.length;
  const percentage = Math.round((metDays / totalDays) * 100);
  const totalXp = days.reduce((acc, d) => acc + d.xpEarned, 0);

  return {
    metDays,
    totalDays,
    percentage,
    totalXp,
  };
}
