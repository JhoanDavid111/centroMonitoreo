// src/styles/theme.js
// Design tokens centrales para la interfaz oscura

export const tokens = {
  colors: {
    surface: {
      primary: '#262626',
      secondary: '#1f1f1f',
      overlay: '#111111',
    },
    border: {
      subtle: '#1d1d1d',
      default: '#666666',
      highlight: '#ffc800',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
      muted: '#aaaaaa',
      warning: '#ffc800',
      danger: '#ff7043',
      inverse: '#111827',
    },
    accent: {
      primary: '#ffc800',
      secondary: '#42a5f5',
      success: '#26c6da',
      warning: '#ec407a',
      info: '#66bb6a',
    },
    status: {
      positive: '#22c55e',
      negative: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
      neutral: '#6b7280',
    },
    chart: ['#ffc800', '#ff7043', '#66bb6a', '#42a5f5', '#ab47bc', '#ec407a', '#26c6da', '#d4e157'],
  },
  font: {
    family: '"Nunito Sans", "Segoe UI", system-ui, sans-serif',
    size: {
      base: '13px',
      sm: '12px',
      md: '14px',
      lg: '16px',
    },
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
  },
  shadow: {
    soft: '0 4px 12px rgba(0,0,0,0.25)',
  },
};

export const colors = {
  gray900: '#111111',
  gray700: '#262626',
  gray600: '#333333',
  gray400: '#9ca3af',
  gray300: '#d1d5db',
  yellow500: '#fbbf24',
  yellow400: '#facc15',
  red500: '#ef4444',
  green500: '#22c55e',
  white: '#ffffff',
  gray200: '#e5e7eb',
  blue500: '#3b82f6',
};

export default tokens;