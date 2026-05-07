import { create } from 'zustand';
import { themes } from '../shared/types/theme';

/** Theme mode type */
export type ThemeMode = 'light' | 'dark';

/**
 * State for theme management
 */
interface ThemeState {
  /** Current theme mode */
  mode: ThemeMode;
  /** Toggle between light and dark themes */
  toggleTheme: () => void;
  /** Current color palette */
  colors: {
    background: string;
    surface: string;
    primary: string;
    text: string;
    textSecondary: string;
    border: string;
  };
}

/**
 * Zustand store for theme management
 * Provides light/dark theme switching
 */
export const useThemeStore = create<ThemeState>()((set) => ({
  mode: 'light',
  colors: themes.light.colors,
  toggleTheme: () =>
    set((state) => {
      const newMode = state.mode === 'light' ? 'dark' : 'light';
      return {
        mode: newMode,
        colors: themes[newMode].colors,
      };
    }),
}));
