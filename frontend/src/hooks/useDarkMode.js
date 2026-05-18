import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export const useDarkMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within ThemeProvider');
  }
  return context;
};
