import { SCORING } from './config';

export interface WeekInput {
  syncedDays: number;     // days with data this week
  previousStreak: number; // consecutive prior qualifying weeks
}
export interface WeekResult {
  qualifies: boolean;
  streak: number;
  points: number;
}

/** Streak and base points for one user-week. Pure function, easy to test. */
export function scoreWeek({ syncedDays, previousStreak }: WeekInput): WeekResult {
  const qualifies = syncedDays >= SCORING.minSyncedDaysForStreakCredit;
  if (!qualifies) return { qualifies, streak: 0, points: 0 }; // no credit for missing data
  return { qualifies, streak: previousStreak + 1, points: SCORING.weeklyReportPoints };
}
