import { create } from 'zustand';
import { themes } from '../shared/types/theme';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  toggleTheme: () => void;
  colors: {
    background: string;
    surface: string;
    primary: string;
    text: string;
    textSecondary: string;
    border: string;
  };
}

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
