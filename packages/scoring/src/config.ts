/**
 * PLACEHOLDER VALUES. The points formula is still open (planning-summary.md, section 12).
 * Design constraints from the discussion: cap daily points, weight consistency over raw
 * totals, only score metrics both devices measure comparably, allow rest days, and use a
 * system-funded multiplier + "Champion" title instead of taking points from friends.
 */
export const SCORING = {
  minSyncedDaysForStreakCredit: 4, // TBD: "data for at least N days that week"
  weeklyReportPoints: 10,          // TBD
  monthlyBadgePoints: 50,          // TBD
  consecutiveMonthlyWinsForBonus: 3,
  championMultiplier: 1.25,        // TBD, system-funded
  dailyPointCap: 5,                // TBD
} as const;
