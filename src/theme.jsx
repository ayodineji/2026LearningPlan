import React from 'react';

export const THEMES = {
  light: {
    name: 'light',
    bg: '#f4f0e8',
    bgElev: '#ebe4d2',
    ink: '#1a1814',
    inkDim: '#3a342a',
    rule: '#1a1814',
    ruleDim: '#9a8f75',
    muted: '#c4bba9',
    invert: '#f4f0e8',
    overlay: 'rgba(26,24,20,0.6)',
    grainOpacity: 0.06,
    grainBlend: 'multiply',
    scrollThumb: '#c4bba9',
  },
  dark: {
    name: 'dark',
    bg: '#12110f',
    bgElev: '#1d1b17',
    ink: '#f0ead8',
    inkDim: '#c4bba9',
    rule: '#f0ead8',
    ruleDim: '#55503f',
    muted: '#2e2a22',
    invert: '#12110f',
    overlay: 'rgba(0,0,0,0.75)',
    grainOpacity: 0.09,
    grainBlend: 'screen',
    scrollThumb: '#3a342a',
  },
};

export const ThemeContext = React.createContext(THEMES.light);
export const useTheme = () => React.useContext(ThemeContext);
