import { create } from 'zustand';

/**
 * Represents an achievement that can be earned
 */
export interface Achievement {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description of the achievement */
  description: string;
  /** Achievement tier */
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  /** When the achievement was earned */
  earnedAt: string;
}

/**
 * Progress state for a user
 */
export interface ProgressState {
  /** List of solve records */
  solves: SolveRecord[];
  /** Earned achievements */
  achievements: Achievement[];
  /** Current daily streak count */
  dailyStreak: number;
  /** Date of last solve */
  lastSolveDate: string | null;
  /** Skill levels for different cube solving phases */
  skillLevels: {
    cross: number;
    f2l: number;
    oll: number;
    pll: number;
  };
}

/**
 * Record of a single solve
 */
export interface SolveRecord {
  /** Unique identifier */
  id: string;
  /** Solve time in milliseconds */
  time: number;
  /** Date of solve */
  date: string;
  /** Scramble used for solve */
  scramble: string;
  /** Session identifier */
  session: string;
}

/**
 * State management for user progress
 */
export interface ProgressStore {
  /** Current progress state */
  progress: ProgressState;
  /** List of achievements (duplicate of progress.achievements) */
  achievements: Achievement[];
  /** Add a new solve to history */
  addSolve: (solve: SolveRecord) => void;
  /** Mark an algorithm as completed */
  completeAlgorithm: (algorithmId: string) => void;
  /** Increment skill level for a phase */
  incrementSkillLevel: (skill: 'cross' | 'f2l' | 'oll' | 'pll', amount?: number) => void;
  /** Get statistics */
  getStats: () => {
    totalSolves: number;
    bestTime: number | null;
    avg5: number | null;
    avg12: number | null;
  };
  /** Update daily streak based on last solve */
  updateDailyStreak: () => void;
}

/**
 * Zustand store for progress tracking
 * Manages solve history, achievements, and skill levels
 */
export const useProgressStore = create<ProgressStore>()((set, get) => ({
  progress: {
    solves: [],
    achievements: [],
    dailyStreak: 0,
    lastSolveDate: null,
    skillLevels: {
      cross: 0,
      f2l: 0,
      oll: 0,
      pll: 0,
    },
  },
  achievements: [],
  addSolve: (solve) =>
    set((state) => {
      const newSolves = [solve, ...state.progress.solves];
      const today = new Date().toISOString().split('T')[0];
      const lastDate = state.progress.lastSolveDate
        ? new Date(state.progress.lastSolveDate).toISOString().split('T')[0]
        : null;

      let newStreak = state.progress.dailyStreak;
      if (lastDate) {
        const lastDateObj = new Date(lastDate);
        const todayObj = new Date(today);
        const diffTime = todayObj.getTime() - lastDateObj.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      // Check for achievements
      const newAchievements = [...state.progress.achievements];
      if (newSolves.length === 10) {
        newAchievements.push({
          id: 'first-10',
          name: 'First 10',
          description: 'Completed your first 10 solves',
          tier: 'bronze',
          earnedAt: new Date().toISOString(),
        });
      }

      return {
        progress: {
          ...state.progress,
          solves: newSolves,
          dailyStreak: newStreak,
          lastSolveDate: today,
          achievements: newAchievements,
        },
        achievements: newAchievements,
      };
    }),
  completeAlgorithm: (algorithmId) =>
    set((state) => {
      // Add achievement for completing algorithm
      const newAchievements = [...state.progress.achievements];
      if (!newAchievements.some((a) => a.id === `algorithm-${algorithmId}`)) {
        newAchievements.push({
          id: `algorithm-${algorithmId}`,
          name: 'Algorithm Master',
          description: `Completed ${algorithmId}`,
          tier: 'silver',
          earnedAt: new Date().toISOString(),
        });
      }

      return {
        progress: {
          ...state.progress,
          achievements: newAchievements,
        },
        achievements: newAchievements,
      };
    }),
  incrementSkillLevel: (skill, amount = 1) =>
    set((state) => ({
      progress: {
        ...state.progress,
        skillLevels: {
          ...state.progress.skillLevels,
          [skill]: state.progress.skillLevels[skill] + amount,
        },
      },
    })),
  getStats: () => {
    const { solves } = get().progress;
    if (solves.length === 0) return { totalSolves: 0, bestTime: null, avg5: null, avg12: null };

    const times = solves.map((s) => s.time).sort((a, b) => a - b);
    const bestTime = times[0];

    const avg5 =
      times.length >= 5
        ? times.slice(0, 5).reduce((a, b) => a + b, 0) / 5
        : null;
    const avg12 =
      times.length >= 12
        ? times.slice(0, 12).reduce((a, b) => a + b, 0) / 12
        : null;

    return {
      totalSolves: solves.length,
      bestTime,
      avg5,
      avg12,
    };
  },
  updateDailyStreak: () => {
    // Called when app starts
    const { progress } = get();
    const today = new Date().toISOString().split('T')[0];
    if (progress.lastSolveDate) {
      const lastDate = new Date(progress.lastSolveDate).toISOString().split('T')[0];
      if (lastDate === today) {
        return; // Already updated today
      }
      const lastDateObj = new Date(lastDate);
      const todayObj = new Date(today);
      const diffDays = (todayObj.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays > 1) {
        // Streak broken
        set({
          progress: {
            ...progress,
            dailyStreak: 0,
          },
        });
      }
    }
  },
}));
