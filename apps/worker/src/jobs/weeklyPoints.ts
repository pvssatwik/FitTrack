import { scoreWeek } from '@flb/scoring';

export async function weeklyPoints(): Promise<void> {
  // TODO: for each user, count synced days for the finished week, call scoreWeek(),
  // upsert weekly_points, and (monthly) award badges / Champion title.
  void scoreWeek;
}
