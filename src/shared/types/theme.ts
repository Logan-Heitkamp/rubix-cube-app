/**
 * Represents a theme configuration for the app
 */
export interface Theme {
  /** Theme mode (light or dark) */
  mode: 'light' | 'dark';
  /** Color palette for the theme */
  colors: {
    background: string;
    surface: string;
    primary: string;
    text: string;
    textSecondary: string;
    border: string;
  };
}

export const themes: Record<string, Theme> = {
  light: {
    mode: 'light',
    colors: {
      background: '#f8fafc',
      surface: '#ffffff',
      primary: '#3b82f6',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0',
    },
  },
  dark: {
    mode: 'dark',
    colors: {
      background: '#0f172a',
      surface: '#1e293b',
      primary: '#60a5fa',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
    },
  },
};
