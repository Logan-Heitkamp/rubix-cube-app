import { useCallback } from 'react';
import { useProgressStore, SolveRecord } from '../../store/useProgressStore';

export function useProgress() {
  const { progress, addSolve, completeAlgorithm, incrementSkillLevel, getStats, achievements, updateDailyStreak } = useProgressStore();

  const recordSolve = useCallback(
    (time: number, scramble: string) => {
      const solve: SolveRecord = {
        id: crypto.randomUUID(),
        time,
        date: new Date().toISOString(),
        scramble,
        session: 'default',
      };
      addSolve(solve);
      updateDailyStreak();
    },
    [addSolve, updateDailyStreak]
  );

  const markAlgorithmLearned = useCallback(
    (algorithmId: string) => {
      completeAlgorithm(algorithmId);
    },
    [completeAlgorithm]
  );

  const incrementSkill = useCallback(
    (skill: 'cross' | 'f2l' | 'oll' | 'pll', amount = 1) => {
      incrementSkillLevel(skill, amount);
    },
    [incrementSkillLevel]
  );

  const getStreakStatus = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDate = progress.lastSolveDate ? new Date(progress.lastSolveDate) : null;
    if (lastDate) {
      lastDate.setHours(0, 0, 0, 0);
    }

    if (!lastDate) return { streak: 0, message: 'No solves yet' };
    if (today.getTime() === lastDate.getTime()) return { streak: progress.dailyStreak, message: 'Same day' };
    if (today.getTime() - lastDate.getTime() === 86400000) return { streak: progress.dailyStreak + 1, message: 'Streak active' };
    return { streak: 0, message: 'Streak broken' };
  }, [progress.lastSolveDate, progress.dailyStreak]);

  const checkAchievement = useCallback(
    (achievementId: string): boolean => {
      return progress.achievements.some((a) => a.id === achievementId);
    },
    [progress.achievements]
  );

  return {
    progress,
    stats: getStats(),
    achievements,
    recordSolve,
    markAlgorithmLearned,
    incrementSkill,
    getStreakStatus,
    checkAchievement,
  };
}
