export const lightTheme = {
  colors: {
    primary: '#1976d2',
    primaryHover: '#1565c0',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#333333',
    textSecondary: '#555555',
    border: '#e0e0e0',
    borderHover: '#1976d2',
    error: '#d32f2f',
    success: '#2e7d32',
    warning: '#f57c00',
    info: '#0288d1',
    overlay: 'rgba(0, 0, 0, 0.5)'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px'
  },
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 12px rgba(0,0,0,0.15)',
    lg: '0 8px 24px rgba(0,0,0,0.2)'
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1280px'
  },
  transitions: {
    fast: '0.15s ease',
    normal: '0.2s ease',
    slow: '0.3s ease'
  },
  typography: {
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '24px',
      xxl: '32px'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75
    }
  },
  zIndex: {
    base: 0,
    dropdown: 10,
    modal: 100,
    tooltip: 1000
  }
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#42a5f5',
    primaryHover: '#1e88e5',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#e0e0e0',
    textSecondary: '#b0b0b0',
    border: '#333333',
    borderHover: '#42a5f5',
    warning: '#ff9800',
    info: '#29b6f6'
  }
};

export type Theme = typeof lightTheme;
